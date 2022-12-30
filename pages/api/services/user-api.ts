import axios, { AxiosRequestConfig } from "axios";
import { Config, SOURCE_SYSTEM } from "../../../constants";
import { getConfig } from "../../../utils/env";

// Associate a social login with a new user
export const registerUserSocialProvider = async (
  provider: string,
  providerType: string,
  providerAccountId: string,
  name: string,
  email: string,
  sourceSystem: string = SOURCE_SYSTEM
): Promise<void> => {
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
      sourceSystem,
    },
  };

  await axios(config);
};

export const getUserByEmail = async (email: string): Promise<unknown> => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `${getConfig(Config.NEXT_PUBLIC_USER_API_URL)}/user/email/${email}`,
    headers: {
      "x-api-key": getConfig(Config.NEXT_PUBLIC_USER_API_KEY),
    },
  };

  const { data } = await axios(config);
  return data;
};
