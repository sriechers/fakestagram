import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import {
  HasuraAdapter,
  hasuraRequest,
  hasuraClaims,
} from "../../../util/HasuraAdapter.js";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: HasuraAdapter(),
  secret: process.env.HASURA_ADMIN_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: Date.now() + account.expires_in * 1000,
          token,
          user,
        };
      }

      return token || null;
    },
    async session({ session, token }) {
      session.user = token.user;
      session.accessToken = token.accessToken;
      session.error = token.error;
      session.hasuraToken = await hasuraClaims(session.user.id);

      return session;
    },
    async signIn({ account, profile }) {
      return {
        account: account,
        ...profile,
      };
    },
    redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
  events: {
    async error(message) {
      /* error in authentication flow */
      console.error(message);
    },
  },
  pages: {
    signIn: "/login",
    signUp: "/login",
  },
});
