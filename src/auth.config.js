export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnProcurement = nextUrl.pathname.startsWith('/procurement');

      if (isOnProcurement) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to /login
      }
      // Allow /login and / to be visited freely
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
        token.roleId = user.roleId;
        token.position = user.position;
        token.department = user.department;
        token.mobile = user.mobile;
        token.gender = user.gender;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.role = token.role;
        session.user.roleId = token.roleId;
        session.user.position = token.position;
        session.user.department = token.department;
        session.user.mobile = token.mobile;
        session.user.gender = token.gender;
      }
      return session;
    },
  },
  providers: [],
};
