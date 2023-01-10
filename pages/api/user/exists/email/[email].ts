import type { NextApiRequest, NextApiResponse } from "next";
import { getUserByEmail } from "../../../../../services/user-api";
import { UserAccountProfile } from "../../../../../types/user";
import { toHttpError } from "../../../../../utils/error/parse";

type Data = {
  userExists: boolean;
  accountType: string | null;
  provider: string | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | { statusCode: number; message: string } | string>
) {
  if (req.method !== "GET") {
    return res.status(405).send("Method Not Allowed");
  }

  const { query } = req;
  const { email } = query;

  try {
    const user: UserAccountProfile | null = await getUserByEmail(<string>email);

    res.status(200).json({
      userExists: !!user,
      accountType: user?.accountType || null,
      provider: user?.provider || null,
    });
  } catch (e) {
    const { statusCode, message } = toHttpError(e);

    if (statusCode === 404) {
      return res.status(200).json({
        userExists: false,
        accountType: null,
        provider: null,
      });
    }
    console.error(`API Error: ${statusCode} ${message}`);
    res.status(statusCode).json({ statusCode, message });
  }
}
