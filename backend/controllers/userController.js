const { Op } = require('sequelize');
const { User, Store, Rating, sequelize } = require('../models');

exports.getUsers = async (req, res, next) => {
  try {
    const { name, email, address, role, sortBy, order } = req.query;

    const where = {};
    if (name) {
      where.name = sequelize.where(
        sequelize.fn('LOWER', sequelize.col('name')),
        'LIKE',
        `%${name.toLowerCase()}%`
      );
    }
    if (email) {
      where.email = sequelize.where(
        sequelize.fn('LOWER', sequelize.col('email')),
        'LIKE',
        `%${email.toLowerCase()}%`
      );
    }
    if (address) {
      where.address = sequelize.where(
        sequelize.fn('LOWER', sequelize.col('address')),
        'LIKE',
        `%${address.toLowerCase()}%`
      );
    }
    if (role) where.role = role;

    // Validate sortBy to avoid injection
    const allowedSortFields = ['name', 'email', 'role', 'createdAt'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order && order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const users = await User.findAll({
      where,
      order: [[sortField, sortOrder]],
      attributes: { exclude: ['password'] }
    });

    return res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, address, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists.'
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      address,
      role
    });

    return res.status(201).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Store, as: 'store' }]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    let userResponse = user.toJSON();
    userResponse.avg_rating = null;

    // If the user is an owner, fetch their store's average rating
    if (user.role === 'owner' && user.store) {
      const avgResult = await Rating.findOne({
        where: { storeId: user.store.id },
        attributes: [[sequelize.fn('AVG', sequelize.col('score')), 'avgRating']],
        raw: true
      });

      const ratingNum = avgResult && avgResult.avgRating ? parseFloat(avgResult.avgRating) : 0;
      userResponse.avg_rating = Math.round(ratingNum * 100) / 100;
    }

    return res.status(200).json({
      success: true,
      data: userResponse
    });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    // Compare with current password
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect.'
      });
    }

    // Assign new password (hook will hash it)
    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully.'
    });
  } catch (error) {
    next(error);
  }
};
