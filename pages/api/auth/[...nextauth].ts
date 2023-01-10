import type { Account, Session, User } from "next-auth";
import NextAuth from "next-auth/next";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { getConfig } from "../../../utils/env";
import { Config } from "../../../constants";
import { AdapterUser } from "next-auth/adapters";
import {
  getUserByEmail,
  authenticateWithCredentials,
} from "../../../services/user-api";
import { signInOrRegisterSocialUser } from "../../../services/social-user";
import { JWT } from "next-auth/jwt";
import { UserAccountProfile } from "../../../types/user";
import createHttpError from "http-errors";

export interface CustomSession extends Session {}

// https://next-auth.js.org/configuration/options
export default NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "text", placeholder: "Email" },
        password: { label: "Password", type: "password" },
      },
      // https://next-auth.js.org/providers/credentials#example---username--password
      async authorize(
        credentials: Record<"email" | "password", string> | undefined
      ): Promise<any> {
        if (!credentials) {
          console.error("Missing credentails in authorization callback");
          return null;
        }

        const { email, password } = credentials;
        const profileData: UserAccountProfile | null = await getUserByEmail(
          email
        );

        if (!profileData) {
          console.error("Back-end user not found");
          return null;
        }

        const tokens: any | null = await authenticateWithCredentials(
          email,
          password
        );

        if (!tokens) {
          console.error("No tokens returned from sign-in");
          return null;
        }

        return profileData;
      },
    }),
    GitHubProvider({
      clientId: <string>getConfig(Config.GITHUB_CLIENT_ID),
      clientSecret: <string>getConfig(Config.GITHUB_CLIENT_SECRET),
    }),
    GoogleProvider({
      clientId: <string>getConfig(Config.GOOGLE_CLIENT_ID),
      clientSecret: <string>getConfig(Config.GOOGLE_CLIENT_SECRET),
    }),
  ],
  debug: getConfig(Config.NEXTAUTH_DEBUG, false) === "1" || false,
  secret: <string>getConfig(Config.NEXTAUTH_SECRET),
  callbacks: {
    // https://next-auth.js.org/configuration/callbacks#sign-in-callback
    // The purpose of this function is to decide if a login request should be authorized
    // E.g check that users have sufficient permissions, roles and their status are not banned
    signIn: async (params: {
      user: User | AdapterUser;
      account: Account | null;
    }): Promise<boolean | string> => {
      const { user, account } = params;

      if (!user) {
        return `/unauthorized?error=${encodeURIComponent(
          `Sign-in authorization params not satisfied: User required`
        )}`;
      }

      if (!account) {
        return `/unauthorized?error=${encodeURIComponent(
          `Sign-in authorization params not satisfied: Account required`
        )}`;
      }

      // Safe to allow login here, since `account.type` was returned by the AWS Cognito authorization call from User API
      if (account.type === "credentials") {
        return true;
      }

      if (account.type === "oauth") {
        return signInOrRegisterSocialUser({ user, account });
      }

      return `/unauthorized?error=${encodeURIComponent(
        `Unsuported account provider type ${account.type}`
      )}`;
    },
    /**
     * This callback is called whenever a JSON Web Token is created (i.e. at sign in) or updated (i.e whenever a session is accessed in the client)
     * https://next-auth.js.org/configuration/callbacks#jwt-callback
     * @param param {args.token}
     * @param param {args.user} For credentials users, this will be null, for social users it will contain their basic details
     * @returns {Promise<JWT>}
     */
    jwt: async ({
      token,
      user,
    }: {
      token: JWT;
      user?: User | AdapterUser | UserAccountProfile | any;
    }): Promise<JWT> => {
      console.log("JWT create callback");
      const { email } = token;

      if (!email) {
        throw createHttpError(
          500,
          "Authentication error: Email missing in JWT callback"
        );
      }

      // Fetch user profile for social logins
      if (!user) {
        user = await getUserByEmail(email);
      }

      if (!user) {
        throw createHttpError(
          500,
          "Authentication error: User missing in JWT callback"
        );
      }

      token.userId = user.id;
      return token;
    },

    // Fired when a session is checked (called AFTER jwt() callback)
    // https://next-auth.js.org/configuration/callbacks#session-callback
    session: async ({
      session,
      user,
      token,
    }: {
      session: Session;
      user: User | AdapterUser;
      token: JWT;
    }): Promise<any> => {
      console.log("Session check callback");

      // {
      //   user: {
      //     name: 'dood.dood',
      //     email: 'dood@dood.com',
      //     image: 'https://s3.ap-southeast-2.amazonaws.com/dev.id-api.static-assets/avatars/x256/01.png',
      //     id: '212d11a3-e676-441b-a247-4147a16aaa74'
      //   },
      //   expires: '2023-02-09T13:10:16.343Z'
      // }

      if (!token?.picture) {
        const credUser: UserAccountProfile | null = await getUserByEmail(
          session.user?.email!
        );

        if (credUser) {
          token.picture = credUser.profile.profileData.avatarUrl;
        }
      }

      return {
        user: {
          name: session.user?.name,
          email: session.user?.email,
          image: token?.picture,
          id: token?.userId,
        },
        expires: session.expires,
      };
    },

    // https://next-auth.js.org/configuration/callbacks#redirect-callback
    async redirect({ url, baseUrl }) {
      const { searchParams, origin } = new URL(url);
      const redirectURL: string | null = searchParams.get("redirectURL");

      if (redirectURL) {
        return redirectURL;
      }

      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (origin === baseUrl) return url;
      return baseUrl;
    },
  },
});
