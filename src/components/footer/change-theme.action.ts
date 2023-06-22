"use server";

import { cookies } from "next/headers";

export async function changeTheme() {
  const cookieStore = cookies();

  const currentTheme = cookieStore.get("theme")?.value || "dark";

  cookieStore.set("theme", currentTheme === "dark" ? "light" : "dark");
}
