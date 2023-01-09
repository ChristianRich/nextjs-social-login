// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { verifyUsername } from "../../../../services/user-api";
import type { HttpError } from "http-errors";
import { getEnvVars } from "../../../../utils/env";

// type Data = {
//   name: string;
// };

export default async function handler(
  req: NextApiRequest,
  // res: NextApiResponse<Data>
  res: NextApiResponse
) {
  const { query } = req;
  const { username } = query;

  try {
    await verifyUsername(<string>username);
    res.status(200).json("");
  } catch (e) {
    const { message, statusCode } = <HttpError>e;
    const envVars = getEnvVars();
    res.status(statusCode).json({ statusCode, message, envVars });
  }
}

// When naming API route .ts files, use this pattern
// username/[username]/verify.ts
