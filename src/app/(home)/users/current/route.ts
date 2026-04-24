import { redirect } from "next/navigation";

import { getOwnerUserId } from "@/lib/auth";

export const GET = async () => {
  return redirect(`/users/${getOwnerUserId()}`);
};
