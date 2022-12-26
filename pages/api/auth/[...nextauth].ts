import NextAuth from "next-auth/next";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

export default NextAuth({
  providers: [
    GitHubProvider({
      clientId: String(process.env.GITHUB_CLIENT_ID),
      clientSecret: String(process.env.GITHUB_CLIENT_SECRET),
    }),
    GoogleProvider({
      clientId: "1234",
      clientSecret: "1234",
    }),
    AppleProvider({
      clientId: "1234",
      clientSecret: "1234",
    }),
  ],
  debug: true,
  pages: {
    signIn: "/auth/signin",
    // signOut: '/auth/signout',
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  // TODO Fetch or create user profile data from User API on sign-in and sign-ups.
  // https://next-auth.js.org/configuration/callbacks
  callbacks: {
    // Use the signIn() callback to control if a user is allowed to sign in.
    // https://next-auth.js.org/configuration/callbacks#sign-in-callback
    signIn: async ({ user, account, profile, email, credentials }) => {
      console.log("NextAuth.signIn");
      // console.log("user", user);
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
    jwt: async ({ token, user, account, profile, isNewUser }): Promise<JWT> => {
      console.log("NextAuth.jwt");

      // console.log(token);
      // {
      //   name: 'Christian Rich',
      //   email: 'christian.schlosrich@gmail.com',
      //   picture: 'https://avatars.githubusercontent.com/u/2510863?v=4',
      //   sub: '2510863'
      // }

      // console.log(user);
      // {
      //   id: '2510863',
      //   name: 'Christian Rich',
      //   email: 'christian.schlosrich@gmail.com',
      //   image: 'https://avatars.githubusercontent.com/u/2510863?v=4'
      // }

      // console.log("account", account);
      // {
      //   provider: 'github',
      //   type: 'oauth',
      //   providerAccountId: '2510863'
      //   access_token: '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',
      //   token_type: 'bearer',
      //   scope: 'read:user,user:email'
      // }

      return token;
    },

    // The session callback is called whenever a session is checked - fired after `jwt()`
    // https://next-auth.js.org/configuration/callbacks#session-callback
    session: async ({ session, token, user }): Promise<Session> => {
      console.log("NextAuth.session");

      // console.log("session", session);
      // session {
      //   user: {
      //     name: 'Christian Rich',
      //     email: 'christian.schlosrich@gmail.com',
      //     image: 'https://avatars.githubusercontent.com/u/2510863?v=4'
      //   },
      //   expires: '2023-01-24T11:50:42.270Z'
      // }

      // console.log("token", token);
      // token {
      //   name: 'Christian Rich',
      //   email: 'christian.schlosrich@gmail.com',
      //   picture: 'https://avatars.githubusercontent.com/u/2510863?v=4',
      //   sub: '2510863',
      //   iat: 1671969041,
      //   exp: 1674561041,
      //   jti: 'd23e5379-439a-4855-99f3-58631dd69cbd'
      // }

      // console.log("user", user);
      return session;
    },

    // The redirect callback is called anytime the user is redirected to a callback URL (e.g. on signin or signout).
    //https://next-auth.js.org/configuration/callbacks#redirect-callback
    // async redirect({ url, baseUrl }) {
    //   console.log("NextAuth.redirect");
    //   const { searchParams, origin } = new URL(url);

    //   if (searchParams.has("redirectURL")) {
    //     // return String(searchParams.get("redirectURL"));
    //   }

    //   // Allows relative callback URLs
    //   if (url.startsWith("/")) return `${baseUrl}${url}`;
    //   // Allows callback URLs on the same origin
    //   else if (origin === baseUrl) return url;
    //   return baseUrl;
    // },
  },
  session: {
    strategy: "jwt",
  },
});
