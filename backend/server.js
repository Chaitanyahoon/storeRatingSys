const app = require('./app');
const { sequelize, User } = require('./models');
const seed = require('./seed');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Synchronize models (creates tables if they don't exist)
    await sequelize.sync();
    console.log('Database models synchronized successfully.');

    // Auto-seed database if no users exist
    try {
      const userCount = await User.count();
      if (userCount === 0) {
        console.log('No users found in database. Running auto-seed to populate demo logins...');
        await seed({ force: false });
        console.log('Auto-seed completed successfully.');
      } else {
        console.log(`Database has ${userCount} users. Skipping auto-seed.`);
      }
    } catch (seedError) {
      console.error('Error during auto-seed check/execution:', seedError);
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
