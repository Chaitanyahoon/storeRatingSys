const { sequelize, User, Store, Rating } = require('./models');
require('dotenv').config();

const seed = async (options = { force: true }) => {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB for seeding.');

    // Conditionally force recreate tables
    if (options.force) {
      await sequelize.sync({ force: true });
      console.log('Tables recreated.');
    } else {
      await sequelize.sync();
      console.log('Tables synchronized.');
    }

    // 1. Create Users (Names are 20-60 characters, Passwords meet requirements)
    const users = await User.bulkCreate([
      {
        name: 'Chaitanya Patil',
        email: 'admin@storerating.com',
        password: 'Password123!',
        address: 'Connaught Place, New Delhi',
        role: 'admin'
      },
      {
        name: 'Chaitanya Patil',
        email: 'owner1@storerating.com',
        password: 'Password123!',
        address: 'Andheri West, Mumbai',
        role: 'owner'
      },
      {
        name: 'Chaitanya Patil',
        email: 'owner2@storerating.com',
        password: 'Password123!',
        address: 'Salt Lake Sector 5, Kolkata',
        role: 'owner'
      },
      {
        name: 'Chaitanya Patil',
        email: 'user1@storerating.com',
        password: 'Password123!',
        address: '789 Indiranagar, Bangalore',
        role: 'user'
      },
      {
        name: 'Priyanka Sen Chowdhury Mumbai',
        email: 'user2@storerating.com',
        password: 'Password123!',
        address: '321 Koregaon Park, Pune',
        role: 'user'
      },
      {
        name: 'Vikram Malhotra Bangalore',
        email: 'user3@storerating.com',
        password: 'Password123!',
        address: '654 Jubilee Hills, Hyderabad',
        role: 'user'
      }
    ], { individualHooks: true }); // Critical: run hooks so beforeSave hashes passwords
    console.log('Users seeded successfully.');

    const owner1 = users[1];
    const owner2 = users[2];
    const user1 = users[3];
    const user2 = users[4];
    const user3 = users[5];

    // 2. Create Stores
    const stores = await Store.bulkCreate([
      {
        name: 'Karan Kirana and Provision Store',
        email: 'store1@storerating.com',
        address: '123 MG Road, Connaught Place, New Delhi',
        ownerId: owner1.id
      },
      {
        name: 'Jodhpur Sweet House and Bakery',
        email: 'store2@storerating.com',
        address: '456 Link Road, Andheri West, Mumbai',
        ownerId: owner2.id
      }
    ]);
    console.log('Stores seeded successfully.');

    const store1 = stores[0];
    const store2 = stores[1];

    // 3. Create Ratings
    await Rating.bulkCreate([
      {
        userId: user1.id,
        storeId: store1.id,
        score: 4
      },
      {
        userId: user2.id,
        storeId: store1.id,
        score: 5
      },
      {
        userId: user3.id,
        storeId: store1.id,
        score: 3
      },
      {
        userId: user1.id,
        storeId: store2.id,
        score: 5
      },
      {
        userId: user2.id,
        storeId: store2.id,
        score: 4
      }
    ]);
    console.log('Ratings seeded successfully.');

    console.log('Database seeded fully!');
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  }
};

if (require.main === module) {
  seed({ force: true })
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = seed;
