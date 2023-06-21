import { getSession, createResponse } from "@/utils/session";

import { IApiMessage } from "../route";

export async function GET(req: Request) {
  const res = new Response();
  const session = await getSession(req, res);
  const resInit: ResponseInit = {
    status: 200,
    headers: { "Content-Type": "application/json" },
  };

  await session.destroy();

  const payload: IApiMessage = {
    status: "SUCCESS",
    message: "User logged out",
  };

  return createResponse(res, JSON.stringify(payload), resInit);
}
