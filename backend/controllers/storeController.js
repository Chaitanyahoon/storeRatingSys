const { Op } = require('sequelize');
const { Store, User, Rating, sequelize } = require('../models');

exports.getStores = async (req, res, next) => {
  try {
    const { name, address, sortBy, order } = req.query;
    const userId = req.user.id;

    // Validate and build sorting parameters
    const allowedSortFields = ['name', 'email', 'address', 'avg_rating', 'my_rating', 'createdAt'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order && order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    // Map sorting field to the correct SQL column/alias
    let sqlSortField = 's.name';
    if (sortField === 'name') sqlSortField = 's.name';
    else if (sortField === 'email') sqlSortField = 's.email';
    else if (sortField === 'address') sqlSortField = 's.address';
    else if (sortField === 'avg_rating') sqlSortField = 'avg_rating';
    else if (sortField === 'my_rating') sqlSortField = 'my_rating';
    else if (sortField === 'createdAt') sqlSortField = 's."createdAt"';

    // Build dialect-aware AVG expression
    const dialect = sequelize.getDialect();
    const avgExpr = dialect === 'postgres'
      ? 'COALESCE(ROUND(CAST(AVG(all_ratings.score) AS numeric), 2), 0)'
      : 'COALESCE(ROUND(AVG(all_ratings.score), 2), 0)';

    // Single query with LEFT JOIN to fetch average score and current user's score
    const query = `
      SELECT 
        s.id, 
        s.name, 
        s.email, 
        s.address, 
        s."ownerId", 
        s."createdAt", 
        s."updatedAt",
        ${avgExpr} AS avg_rating,
        my_rating.score AS my_rating,
        owner.name AS "ownerName",
        owner.email AS "ownerEmail"
      FROM "Stores" AS s
      LEFT JOIN "Ratings" AS all_ratings ON s.id = all_ratings."storeId"
      LEFT JOIN "Ratings" AS my_rating ON s.id = my_rating."storeId" AND my_rating."userId" = :userId
      LEFT JOIN "Users" AS owner ON s."ownerId" = owner.id
      WHERE (LOWER(s.name) LIKE LOWER(:nameFilter) AND LOWER(s.address) LIKE LOWER(:addressFilter))
      GROUP BY s.id, my_rating.id, my_rating.score, owner.id, owner.name, owner.email
      ORDER BY ${sqlSortField} ${sortOrder}
    `;

    const stores = await sequelize.query(query, {
      replacements: {
        userId,
        nameFilter: `%${name || ''}%`,
        addressFilter: `%${address || ''}%`
      },
      type: sequelize.QueryTypes.SELECT
    });

    // Parse ratings back to numeric types
    const formattedStores = stores.map(store => ({
      ...store,
      avg_rating: parseFloat(store.avg_rating),
      my_rating: store.my_rating ? parseInt(store.my_rating, 10) : null
    }));

    return res.status(200).json({
      success: true,
      data: formattedStores
    });
  } catch (error) {
    next(error);
  }
};

exports.createStore = async (req, res, next) => {
  try {
    const { name, email, address, ownerId } = req.body;

    // Check if the owner user exists and is an owner
    const owner = await User.findByPk(ownerId);
    if (!owner) {
      return res.status(404).json({
        success: false,
        message: 'Owner user not found.'
      });
    }

    if (owner.role !== 'owner') {
      return res.status(400).json({
        success: false,
        message: 'Assigned user does not have the "owner" role.'
      });
    }

    // Check if the owner already owns a store
    const existingStore = await Store.findOne({ where: { ownerId } });
    if (existingStore) {
      return res.status(400).json({
        success: false,
        message: 'This owner is already assigned to a store.'
      });
    }

    const store = await Store.create({
      name,
      email,
      address,
      ownerId
    });

    return res.status(201).json({
      success: true,
      data: store
    });
  } catch (error) {
    next(error);
  }
};
