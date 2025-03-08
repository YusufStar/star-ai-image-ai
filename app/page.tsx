import React from "react";

import ClientWrapper from "./_components/ClientWrapper";

import { createClient } from "@/lib/supabase/server";
import { getProducts, getUser } from "@/lib/supabase/queries";

const DashboardPage = async () => {
  const supabase = await createClient();
  const [user, products] = await Promise.all([
    getUser(supabase),
    getProducts(supabase),
  ]);

  return <ClientWrapper products={products || []} />;
};

export default DashboardPage;
