/* istanbul ignore file */

import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";
import createError from "http-errors";
import NodeCache from "node-cache";

const memCache: NodeCache = new NodeCache({
  stdTTL: 300,
  checkperiod: 0,
  deleteOnExpire: false,
});

/**
 * SECURITY WARNING: Returns raw API keys
 * @param {string} secretId /prm-app/int/env/app/resource
 * @param {string} secretName MY_VAR - when provided a process.env var is created
 * @param {SecretsManagerClient} client
 * @returns {string} SecretString
 */
export const loadSecret = async (
  secretId: string,
  secretName?: string,
  cache: boolean = true,
  client: SecretsManagerClient = new SecretsManagerClient({
    region: process.env.AWS_REGION,
  })
): Promise<string> => {
  if (cache && memCache.has(secretId)) {
    return <string>memCache.get(secretId);
  }
  try {
    const command: GetSecretValueCommand = new GetSecretValueCommand({
      SecretId: secretId,
    });

    const { SecretString } = await client.send(command);
    memCache.set(secretId, SecretString);

    if (secretName) {
      console.log(`Set process.env.${secretName}=********`);
      process.env[secretName] = SecretString;
    }

    return <string>SecretString;
  } catch (error) {
    const { message, name } = error as any;

    if (name === "ResourceNotFoundException") {
      throw createError(404, `SecretId not found: ${secretId}`);
    }

    throw createError(
      500,
      `Error retrieving SecretId ${secretId}: ${name}: ${message}`
    );
  }
};
