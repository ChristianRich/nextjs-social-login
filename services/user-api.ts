import axios from "axios";
import { HttpError } from "http-errors";
import { Config, SOURCE_SYSTEM } from "../constants";
import { UserAccountProfile } from "../types/user";
import { getConfig } from "../utils/env";
import { toHttpError } from "../utils/error/parse";

export const getUserByEmail = async (
  email: string
): Promise<UserAccountProfile | null> => {
  try {
    const { data } = await axios({
      method: "GET",
      // url: `${getConfig(Config.USER_API_URL)}/user/email/${email}`,
      url: `${process.env.USER_API_URL}/user/email/${email}`,
      headers: {
        "x-api-key": getConfig(Config.USER_API_KEY),
      },
    });
    return data;
  } catch (e) {
    throw <HttpError>toHttpError(e);
  }
};

export const verifyUsername = async (username: string): Promise<void> => {
  try {
    await axios({
      method: "GET",
      url: `${getConfig(Config.USER_API_URL)}/username/${encodeURIComponent(
        username.trim()
      )}/verify`,
      headers: {
        "x-api-key": getConfig(Config.USER_API_KEY),
      },
    });
  } catch (e) {
    throw <HttpError>toHttpError(e);
  }
};

export const createSocialUser = async (
  provider: string,
  providerType: string,
  providerAccountId: string,
  name: string,
  email: string
): Promise<UserAccountProfile> => {
  try {
    console.log("createSocialUser()", { name, email, provider });
    const { data } = await axios({
      method: "POST",
      url: `${getConfig(Config.USER_API_URL)}/user/social`,
      headers: {
        "x-api-key": getConfig(Config.USER_API_KEY),
      },
      data: {
        provider,
        providerType,
        providerAccountId,
        name,
        email,
        sourceSystem: SOURCE_SYSTEM,
      },
    });
    return data;
  } catch (e) {
    throw <HttpError>toHttpError(e);
  }
};

export const createCredentialsUser = async ({
  name,
  email,
  password,
  repeatPassword,
  sourceSystem = SOURCE_SYSTEM,
}): Promise<UserAccountProfile> => {
  try {
    console.log("createCredentialsUser()", { name, email });
    const { data } = await axios({
      method: "POST",
      url: `${getConfig(Config.USER_API_URL)}/user`,
      headers: {
        "x-api-key": getConfig(Config.USER_API_KEY),
      },
      data: {
        name,
        email,
        password,
        repeatPassword,
        sourceSystem,
      },
    });
    return data;
  } catch (e) {
    throw <HttpError>toHttpError(e);
  }
};

// TODO Types for tokens. And how are tokens handled?
export const authenticateWithCredentials = async (
  email: string,
  password: string
): Promise<unknown> => {
  try {
    console.log("authenticateWithCredentials()", { email });
    const { data } = await axios({
      method: "POST",
      url: `${getConfig(Config.USER_API_URL)}/auth/login`,
      headers: {
        "x-api-key": getConfig(Config.USER_API_KEY),
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        email,
        password,
      }),
    });
    return data;
  } catch (e) {
    throw <HttpError>toHttpError(e);
  }
};
