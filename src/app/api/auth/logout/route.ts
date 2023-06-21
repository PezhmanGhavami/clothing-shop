import { redirect } from "next/navigation";

import { getSession } from "@/utils/session";

export async function GET(req: Request) {
  const res = new Response();
  const session = await getSession(req, res);

  await session.destroy();

  return redirect("/");
}
