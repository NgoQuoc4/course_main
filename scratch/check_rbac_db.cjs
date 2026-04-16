const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../server/.env') });

const Customer = require('../server/models/Customer');
const Role = require('../server/models/Role');

async function checkDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const admin = await Customer.findOne({ email: 'admin@cfdcourse.vn' }).populate('role');
    if (admin) {
      console.log('Admin User Found:');
      console.log(' - Name:', admin.firstName, admin.lastName);
      console.log(' - Email:', admin.email);
      console.log(' - Role (raw):', admin.role?._id || admin.role);
      console.log(' - Role (populated):', admin.role?.slug || 'Not populated/assigned');
    } else {
      console.log('Admin user not found!');
    }

    const rolesCount = await Role.countDocuments();
    console.log('Total Roles in DB:', rolesCount);
    const roles = await Role.find();
    console.log('Roles slugs:', roles.map(r => r.slug));

    const totalCustomers = await Customer.countDocuments();
    console.log('Total Customers:', totalCustomers);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
}

checkDb();
