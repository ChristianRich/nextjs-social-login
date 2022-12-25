import NextAuth from "next-auth/next";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";

export default NextAuth({
  providers: [
    GitHubProvider({
      clientId: String(process.env.GITHUB_ID),
      clientSecret: String(process.env.GITHUB_SECRET),
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
  secret: String(process.env.JWT_SECRET),
  debug: false,
  pages: {
    signIn: "/auth/signin-v2",
    // signOut: '/auth/signout',
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  // TODO We need to capture social login and signups, create profiles etc.
  callbacks: {
    async redirect({ url, baseUrl }) {
      console.log("CB");
      console.log(url); // http://localhost:3000/login?redirectURL=https://3000

      const { searchParams } = new URL(url);
      const redirectURL: string | null = searchParams.get("redirectURL");

      if (redirectURL) {
        console.log("Catch redirect!");
        return redirectURL;
      }

      // console.log(baseUrl); // http://localhost:3000
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;

      //   if (searchParams.redirectURL) {
      //   }

      return baseUrl;
    },
  },
});
