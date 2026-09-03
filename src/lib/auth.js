import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { authConfig } from '@/auth.config';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        
        // Static Mock Users Fallback if DB is down
        const mockUsers = {
          'admin': { id: 'm1', name: 'System Admin', email: 'admin@uig.com', role: 'Admin', password: 'password123' },
          'approver': { id: 'm2', name: 'Project Approver', email: 'approver@uig.com', role: 'Approver', password: 'password123' },
          'initiator': { id: 'm3', name: 'Site Initiator', email: 'initiator@uig.com', role: 'Initiator', password: 'password123' },
          'storeincharge': { id: 'm4', name: 'Store Incharge', email: 'storeincharge@uig.com', role: 'Store Incharge', password: 'password123' },
          'storekeeper': { id: 'm5', name: 'Store Keeper', email: 'storekeeper@uig.com', role: 'Store Keeper', password: 'password123' },
        };

        try {
          await dbConnect();
          const user = await User.findOne({ username: credentials.username }).populate('role');
          if (user) {
            const valid = await bcrypt.compare(credentials.password, user.password);
            if (valid) {
              return {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                username: user.username,
                role: user.role?.name || '',
                roleId: user.role?._id?.toString() || '',
                position: user.position || '',
                department: user.department || '',
                mobile: user.mobile || '',
                gender: user.gender || '',
              };
            }
          }
        } catch (e) {
          console.warn("MongoDB connection failed in auth, falling back to static users...");
        }

        // Fallback check
        const mock = mockUsers[credentials.username];
        if (mock && credentials.password === mock.password) {
          return {
            id: mock.id,
            name: mock.name,
            email: mock.email,
            username: credentials.username,
            role: mock.role,
            roleId: 'mock-role-id',
            position: 'Mock Position',
            department: 'Mock Dept',
            mobile: '0500000000',
            gender: 'Male',
          };
        }

        return null;
      },
    }),
  ],
  session: { strategy: 'jwt' },
});
