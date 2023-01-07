import type { Account, User } from "next-auth";
import NextAuth from "next-auth/next";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { getConfig } from "../../../utils/env";
import { Config } from "../../../constants";
import { AdapterUser } from "next-auth/adapters";
import { getUserByEmail, signInUser } from "../services/user-api";
import { signInOrRegisterSocialUser } from "../services/social-user";

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
      async authorize(
        credentials: Record<"email" | "password", string> | undefined
      ): Promise<User | null> {
        if (!credentials) {
          console.error("Missing credentails in authorization callback");
          return null;
        }

        const { email, password } = credentials;
        const userProfileData: any | null = await getUserByEmail(email);

        if (!userProfileData) {
          console.error("Back-end user not found");
          return null;
        }

        const tokens: any | null = await signInUser(email, password);

        if (!tokens) {
          console.error("No tokens returned from sign-in");
          return null;
        }

        // TODO User profile for both flows must be identical ..
        return <User>{
          id: userProfileData.id,
          name: userProfileData.name,
          email: userProfileData.email,
          image:
            "https://png.pngtree.com/png-clipart/20210129/ourmid/pngtree-graphic-default-avatar-png-image_2813121.jpg", // TODO Remove
        };
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
    signIn: async (params: {
      user: User | AdapterUser;
      account: Account | null;
    }): Promise<boolean | string> => {
      const { user, account } = params;

      if (!user || !account) {
        return `/unauthorized?error=${encodeURIComponent(
          `Authorization params not satisfied`
        )}`;
      }

      if (account.type === "oauth") {
        return signInOrRegisterSocialUser({ user, account });
      }

      if (account.type === "credentials") {
        return true;
      }

      console.error(`Unsuported account provider type ${account.type}`);
      return false;
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
