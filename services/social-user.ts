import { createSocialUser, getUserByEmail, verifyUsername } from "./user-api";
import slugify from "slugify";
import { generateUsername } from "username-generator";
import { HttpError } from "http-errors";
import { AdapterUser } from "next-auth/adapters";
import { Account, User } from "next-auth";

export const signInOrRegisterSocialUser = async (params: {
  user: User | AdapterUser;
  account: Account;
}): Promise<boolean | string> => {
  const { account, user } = params;
  const { email } = user;

  if (!email) {
    return `/unauthorized?error=${encodeURIComponent(
      "User email expected from social provider auth response"
    )}`;
  }

  const { provider, providerAccountId, type: providerType } = account;

  try {
    const existingUser: unknown | null = await getUserByEmail(email);

    // Account found, return true to allow login
    if (existingUser) {
      return true;
    }
  } catch (e) {
    const { message } = <HttpError>e;
    console.log("CATCH getUserByEmail");
    console.log(e);
    return `/unauthorized?error=${encodeURIComponent(
      `Account creation error: ${message}`
    )}`;
  }

  // Use their social account profile info to create a username
  let username = createUsername(user);

  // When a username collision occurs, fallback to a unique random username e.g "appearance.spiky.440"
  try {
    await verifyUsername(username);
  } catch (error) {
    username = generateUniqueUsernam();
  }

  try {
    await createSocialUser(
      provider,
      providerType,
      providerAccountId,
      username,
      email
    );

    return true;
  } catch (e) {
    const { message, name } = <HttpError>e;
    return `/unauthorized?error=${encodeURIComponent(
      "Error creating new linked social user"
    )}`;
  }
};

// Auto-generate a username for social accounts
export const createUsername = (user: User | AdapterUser): string => {
  if (user?.name) {
    return slugify(user.name, {
      lower: true,
      trim: true,
      replacement: ".",
    });
  }

  if (user?.email) {
    return slugify(user.email.split("@")[0], {
      lower: true,
      trim: true,
      replacement: ".",
    });
  }

  return generateUniqueUsernam();
};

// Creates unique usernames for social logins e.g "appearance.spiky.440" (fallback method to ensure uniqueness)
export const generateUniqueUsernam = () =>
  `${generateUsername(".")}.${new Date().getTime().toString().slice(-3)}`;
