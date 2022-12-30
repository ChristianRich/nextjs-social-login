export class Config {
  static readonly GITHUB_CLIENT_ID = "GITHUB_CLIENT_ID";
  static readonly GITHUB_CLIENT_SECRET = "GITHUB_CLIENT_SECRET";

  static readonly GOOGLE_CLIENT_ID = "GOOGLE_CLIENT_ID";
  static readonly GOOGLE_CLIENT_SECRET = "GOOGLE_CLIENT_SECRET";

  static readonly APPLE_CLIENT_ID = "APPLE_CLIENT_ID";
  static readonly APPLE_CLIENT_SECRET = "APPLE_CLIENT_SECRET";

  static readonly NEXTAUTH_URL = "NEXTAUTH_URL";
  static readonly NEXTAUTH_SECRET = "NEXTAUTH_SECRET";
  static readonly NEXTAUTH_DEBUG = "NEXTAUTH_DEBUG"; // Not official to NextAuth

  static readonly NEXT_PUBLIC_USER_API_URL = "NEXT_PUBLIC_USER_API_URL";
  static readonly NEXT_PUBLIC_USER_API_KEY = "NEXT_PUBLIC_USER_API_KEY";
}

// https://nextjs.org/docs/basic-features/environment-variables#environment-variable-load-order
export enum NODE_ENV {
  TST = "test", // Rarely used
  DEV = "development", // = my localhost
  PRD = "production", // When main branch is deployed with AWS Amplify
}

export const SOURCE_SYSTEM = "slshub.com";
