import NextAuth from "next-auth/next";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { getConfig } from "../../../utils/env";
import { Config } from "../../../constants";
import { AdapterUser } from "next-auth/adapters";

// https://next-auth.js.org/configuration/options
export default NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    GitHubProvider({
      clientId: <string>getConfig(Config.GITHUB_CLIENT_ID),
      clientSecret: <string>getConfig(Config.GITHUB_CLIENT_SECRET),
    }),
    GoogleProvider({
      clientId: <string>getConfig(Config.GOOGLE_CLIENT_ID),
      clientSecret: <string>getConfig(Config.GOOGLE_CLIENT_SECRET),
    }),
    AppleProvider({
      clientId: <string>getConfig(Config.APPLE_CLIENT_ID),
      clientSecret: <string>getConfig(Config.APPLE_CLIENT_SECRET),
    }),
  ],
  debug: getConfig(Config.NEXTAUTH_DEBUG, false) === "1" || false,
  secret: <string>getConfig(Config.NEXTAUTH_SECRET),
  pages: {
    signIn: "/auth/signin",
    // signOut: '/auth/signout',
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  // https://next-auth.js.org/configuration/callbacks
  callbacks: {
    // Use the signIn() callback to control if a user is allowed to sign in
    // https://next-auth.js.org/configuration/callbacks#sign-in-callback
    signIn: async ({ user, account, profile, email, credentials }) => {
      console.log(
        "NextAuth.signIn",
        user,
        account,
        profile,
        email,
        credentials
      );

      // user {
      //   id: '2510863',
      //   name: 'Christian Rich',
      //   email: 'christian.schlosrich@gmail.com',
      //   image: 'https://avatars.githubusercontent.com/u/2510863?v=4'
      // }

      // console.log("account", account);
      // account {
      //   provider: 'github',
      //   type: 'oauth',
      //   providerAccountId: '2510863',
      //   access_token: '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',
      //   token_type: 'bearer',
      //   scope: 'read:user,user:email'
      // }

      // Check User API here (UPSERT)

      // 1. Check if user exists by email
      // 2. If not, create user in User API and redirect to /accounts

      // Stuff to capture

      return true;
    },
    // This callback is called whenever a JSON Web Token is created (i.e. at sign in) or updated (i.e whenever a session is accessed in the client)
    // https://next-auth.js.org/configuration/callbacks#jwt-callback
    jwt: async ({
      token,
      user,
    }: {
      token: JWT;
      user?: User | AdapterUser;
    }): Promise<JWT> => {
      console.log("NextAuth.jwt callback");
      return token;
    },

    // The session callback is called whenever a session is checked - fired after `jwt()`
    // https://next-auth.js.org/configuration/callbacks#session-callback
    session: async ({
      session,
      user,
      token,
    }: {
      session: Session;
      user: User | AdapterUser;
      token: JWT;
    }): Promise<Session> => {
      console.log("NextAuth.session callback");
      return session;
    },

    // The redirect callback is called anytime the user is redirected to a callback URL (e.g. on signin or signout).
    //https://next-auth.js.org/configuration/callbacks#redirect-callback
    async redirect({ url, baseUrl }) {
      console.log("NextAuth.redirect");
      const { searchParams, origin } = new URL(url);

      // if (searchParams.has("redirectURL")) {
      // return String(searchParams.get("redirectURL"));
      // }

      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (origin === baseUrl) return url;
      return baseUrl;
    },
  },
});
