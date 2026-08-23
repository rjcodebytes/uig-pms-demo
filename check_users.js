const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function main() {
  await mongoose.connect('mongodb://localhost:27017/pms');
  
  const users = await mongoose.connection.collection('users').find({}).toArray();
  console.log('Users in DB:', users.map(u => ({ username: u.username, role: u.role })));

  if (users.length === 0) {
    console.log('No users found. You can create one or we can script it.');
  } else {
    // If we want to reset a password for the first user
    const firstUser = users[0];
    const newPassword = 'password123';
    const hash = await bcrypt.hash(newPassword, 10);
    await mongoose.connection.collection('users').updateOne({ _id: firstUser._id }, { $set: { password: hash } });
    console.log(`Reset password for ${firstUser.username} to: ${newPassword}`);
  }
  
  process.exit(0);
}

main().catch(console.error);
