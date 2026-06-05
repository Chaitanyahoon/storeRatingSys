const sequelize = require('../config/database');
const User = require('./User');
const Store = require('./Store');
const Rating = require('./Rating');

// Associations

// User - Store association (1-to-1: Owner has a store)
User.hasOne(Store, { foreignKey: 'ownerId', as: 'store', onDelete: 'CASCADE' });
Store.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// User - Rating association (1-to-many)
User.hasMany(Rating, { foreignKey: 'userId', as: 'ratings', onDelete: 'CASCADE' });
Rating.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Store - Rating association (1-to-many)
Store.hasMany(Rating, { foreignKey: 'storeId', as: 'ratings', onDelete: 'CASCADE' });
Rating.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });

module.exports = {
  sequelize,
  User,
  Store,
  Rating
};
