import React from "react";
import { redirect } from "next/navigation";

import ClientWrapper from "./_components/ClientWrapper";

import { createClient } from "@/lib/supabase/server";
import { getProducts, getUser } from "@/lib/supabase/queries";

const DashboardPage = async () => {
  const supabase = await createClient();
  const [user, products] = await Promise.all([
    getUser(supabase),
    getProducts(supabase),
  ]);

  if (user) {
    redirect("/dashboard");
  }

  return (
    <ClientWrapper products={products || []} />
  );
};

export default DashboardPage;
