import React from "react";
import { redirect } from "next/navigation";

import AccountForm from "./_components/AccountForm";
import PasswordForm from "./_components/PasswordForm";

import { PageHeader } from "@/components/header";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/queries";

const SettingsPage = async () => {
  const supabase = await createClient();
  const user = await getUser(supabase);

  if (!user) {
    redirect("/login");
  }

  return (
    <section className="custom-container mx-auto w-full">
      <PageHeader
        subtitle="Manage your account settings and security preferences."
        title="Settings"
      />

      <div className="mt-8 grid gap-8">
        <AccountForm user={user} />
        <PasswordForm />
      </div>
    </section>
  );
};

export default SettingsPage;
