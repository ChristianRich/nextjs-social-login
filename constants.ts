import { loadSecret } from "./pages/api/services/aws-sm";
import { getConfig } from "./utils/env";

export class Config {
  static readonly GITHUB_CLIENT_ID = "GITHUB_CLIENT_ID";
  static readonly GITHUB_CLIENT_SECRET = "GITHUB_CLIENT_SECRET";
  static readonly NEXTAUTH_URL = "NEXTAUTH_URL";
  static readonly NEXTAUTH_SECRET = "NEXTAUTH_SECRET";
}

export enum SECRETS {
  GITHUB_CLIENT_ID = "slshub.com/github_client_id",
  GITHUB_CLIENT_SECRET = "slshub.com/github_client_secret",
  NEXTAUTH_SECRET = "slshub.com/nextauth_secret",
}

// https://nextjs.org/docs/basic-features/environment-variables#environment-variable-load-order
export enum NODE_ENV {
  TST = "test", // Rarely used
  DEV = "development", // localhost
  PRD = "production", // prod
}

export const loadSecrets = async () => {
  const env = getConfig("NODE_ENV", false, NODE_ENV.DEV);

  await Promise.all([
    loadSecret(`${env}/${SECRETS.GITHUB_CLIENT_ID}`, Config.GITHUB_CLIENT_ID),
    loadSecret(
      `${env}/${SECRETS.GITHUB_CLIENT_SECRET}`,
      Config.GITHUB_CLIENT_SECRET
    ),
    loadSecret(`${env}/${SECRETS.NEXTAUTH_SECRET}`, Config.NEXTAUTH_SECRET),
  ]);
};