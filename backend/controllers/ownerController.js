const { Store, Rating, User, sequelize } = require('../models');

exports.getOwnerDashboard = async (req, res, next) => {
  try {
    const ownerId = req.user.id;

    // Find the store owned by the current user
    const store = await Store.findOne({ where: { ownerId } });
    if (!store) {
      return res.status(200).json({
        success: true,
        data: {
          store: null,
          avgRating: 0,
          ratings: []
        }
      });
    }

    // Get the average rating
    const avgResult = await Rating.findOne({
      where: { storeId: store.id },
      attributes: [[sequelize.fn('AVG', sequelize.col('score')), 'avgRating']],
      raw: true
    });

    const ratingNum = avgResult && avgResult.avgRating ? parseFloat(avgResult.avgRating) : 0;
    const avgRating = Math.round(ratingNum * 100) / 100;

    // Get the list of raters and their scores
    const ratings = await Rating.findAll({
      where: { storeId: store.id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const ratingsList = ratings.map(r => ({
      userName: r.user ? r.user.name : 'Unknown User',
      userEmail: r.user ? r.user.email : 'Unknown Email',
      score: r.score
    }));

    return res.status(200).json({
      success: true,
      data: {
        store: {
          id: store.id,
          name: store.name,
          email: store.email,
          address: store.address
        },
        avgRating,
        ratings: ratingsList
      }
    });
  } catch (error) {
    next(error);
  }
};
