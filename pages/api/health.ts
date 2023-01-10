// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  now: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | { statusCode: number; message: string } | string>
) {
  if (req.method !== "GET") {
    return res.status(405).send("Method Not Allowed");
  }

  res.status(200).json({ now: new Date().toISOString() });
}
