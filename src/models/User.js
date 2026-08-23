import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name:       { type: String, required: true },
    email:      { type: String, required: true, unique: true },
    mobile:     { type: String, required: true },
    gender:     { type: String, required: true },
    username:   { type: String, required: true, unique: true },
    password:   { type: String, required: true },
    role:       { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
    position:   { type: String, default: null },   // e.g. "Head Of Department"
    department: { type: String, default: null },   // ref by name (matches DeptModel behaviour)
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
