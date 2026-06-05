const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.DATABASE_URL) {
  // Production: Use Supabase PostgreSQL via DATABASE_URL
  console.log('Connecting to PostgreSQL via DATABASE_URL.');
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else if (process.env.DB_DIALECT === 'sqlite' || !process.env.DB_HOST || process.env.DB_HOST === 'localhost_fallback') {
  // Local development fallback: SQLite
  console.log('Using SQLite fallback database for instant local run.');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './store_rating.sqlite',
    logging: process.env.NODE_ENV === 'development' ? console.log : false
  });
} else {
  // Explicit PostgreSQL connection via individual env vars
  sequelize = new Sequelize(
    process.env.DB_NAME || 'store_rating',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'postgres',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      dialectOptions: (process.env.DB_SSL === 'true' || (process.env.DB_HOST && !process.env.DB_HOST.includes('localhost') && !process.env.DB_HOST.includes('127.0.0.1'))) ? {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      } : {},
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
}

module.exports = sequelize;
