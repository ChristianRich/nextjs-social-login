import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { Config, SOURCE_SYSTEM } from "../../../constants";
import { getConfig } from "../../../utils/env";
import { axiosToHttpError } from "../../../utils/error/parse";

export const getUserByEmail = async (
  email: string
): Promise<unknown | null> => {
  try {
    const config: AxiosRequestConfig = {
      method: "GET",
      url: `${getConfig(Config.NEXT_PUBLIC_USER_API_URL)}/user/email/${email}`,
      headers: {
        "x-api-key": getConfig(Config.NEXT_PUBLIC_USER_API_KEY),
      },
    };

    console.log("getUserByEmail()", config);
    const { data } = await axios(config);
    return data;
  } catch (e) {
    const { response } = <AxiosError>e;

    if (response?.status === 404) {
      return null;
    }

    throw axiosToHttpError(e, "getUserByEmail");
  }
};

// Returns 200 when usename is valid and available. Otherwise returns 400 with an error message
export const verifyUsername = async (username: string): Promise<void> => {
  try {
    const config: AxiosRequestConfig = {
      method: "GET",
      url: `${getConfig(
        Config.NEXT_PUBLIC_USER_API_URL
      )}/username/${encodeURIComponent(username)}/verify`,
      headers: {
        "x-api-key": getConfig(Config.NEXT_PUBLIC_USER_API_KEY),
      },
    };

    console.log("verifyUsername()", config);
    await axios(config);
  } catch (e) {
    throw axiosToHttpError(e, "verifyUsername");
  }
};

export const createSocialUser = async (
  provider: string,
  providerType: string,
  providerAccountId: string,
  name: string,
  email: string
): Promise<unknown> => {
  try {
    const config: AxiosRequestConfig = {
      method: "POST",
      url: `${getConfig(Config.NEXT_PUBLIC_USER_API_URL)}/user/social`,
      headers: {
        "x-api-key": getConfig(Config.NEXT_PUBLIC_USER_API_KEY),
      },
      data: {
        provider,
        providerType,
        providerAccountId,
        name,
        email,
        sourceSystem: SOURCE_SYSTEM,
      },
    };

    console.log("createSocialUser()", config);
    const { data } = await axios(config);
    return data;
  } catch (e) {
    const { name, message } = <AxiosError>e;
    console.error(`Error createSocialUser() ${name} ${message}`);
    throw axiosToHttpError(e, "createSocialUser");
  }
};

export const signInUser = async (
  email: string,
  password: string
): Promise<unknown> => {
  try {
    const config: AxiosRequestConfig = {
      method: "POST",
      url: `${getConfig(Config.NEXT_PUBLIC_USER_API_URL)}/auth/login`,
      headers: {
        "X-Api-Key": getConfig(Config.NEXT_PUBLIC_USER_API_KEY),
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        email,
        password,
      }),
    };

    console.log("SignIn()", config);
    const { data } = await axios(config);
    return data;
  } catch (e) {
    throw axiosToHttpError(e, "signInUser");
  }
};
