"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  return (
    <button
      onClick={async () => {
        await supabase.auth.signOut();
        router.push("/admin/login");
        router.refresh();
      }}
      className="tracked-caps text-charcoal-soft hover:text-sage-deep"
    >
      Sign Out
    </button>
  );
}
