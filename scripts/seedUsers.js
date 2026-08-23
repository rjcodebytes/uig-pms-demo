const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Temporary Mongoose definitions for seeding without importing the whole app
const RoleSchema = new mongoose.Schema({ name: String }, { timestamps: true });
const Role = mongoose.models.Role || mongoose.model('Role', RoleSchema);

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  gender: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
  position: { type: String, default: null },
  department: { type: String, default: null },
}, { timestamps: true });
const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seed() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pms';
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  // Clear existing Users and Roles
  await User.deleteMany({});
  await Role.deleteMany({});
  console.log('Cleared existing users and roles');

  // Seed Roles
  const rolesData = ['Admin', 'Approver', 'Initiator', 'Store Incharge', 'Store Keeper'];
  const createdRoles = {};
  for (const rName of rolesData) {
    const r = await Role.create({ name: rName });
    createdRoles[rName] = r._id;
  }
  console.log('Seeded Roles');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Seed Users
  const usersData = [
    {
      name: 'System Admin',
      email: 'admin@uig.com',
      mobile: '0500000001',
      gender: 'Male',
      username: 'admin',
      password: hashedPassword,
      role: createdRoles['Admin'],
      position: 'IT Director',
      department: 'IT',
    },
    {
      name: 'Project Approver',
      email: 'approver@uig.com',
      mobile: '0500000002',
      gender: 'Female',
      username: 'approver',
      password: hashedPassword,
      role: createdRoles['Approver'],
      position: 'Procurement Manager',
      department: 'Procurement',
    },
    {
      name: 'Site Initiator',
      email: 'initiator@uig.com',
      mobile: '0500000003',
      gender: 'Male',
      username: 'initiator',
      password: hashedPassword,
      role: createdRoles['Initiator'],
      position: 'Site Engineer',
      department: 'Engineering',
    },
    {
      name: 'Store Incharge',
      email: 'storeincharge@uig.com',
      mobile: '0500000004',
      gender: 'Male',
      username: 'storeincharge',
      password: hashedPassword,
      role: createdRoles['Store Incharge'],
      position: 'Warehouse Manager',
      department: 'Logistics',
    },
    {
      name: 'Store Keeper',
      email: 'storekeeper@uig.com',
      mobile: '0500000005',
      gender: 'Male',
      username: 'storekeeper',
      password: hashedPassword,
      role: createdRoles['Store Keeper'],
      position: 'Warehouse Staff',
      department: 'Logistics',
    },
  ];

  await User.insertMany(usersData);
  console.log('Seeded Users successfully.');
  console.log('--- TEST ACCOUNTS ---');
  console.log('Password for all users is: password123');
  usersData.forEach(u => console.log(`- Username: ${u.username} | Role: ${Object.keys(createdRoles).find(k => createdRoles[k] === u.role)}`));

  process.exit(0);
}

seed().catch(console.error);
