import { redirect } from "next/navigation";

import PlanSummary from "./_components/PlanSummary";

import { getSubscription, getProducts, getUser } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/header";

const BillingPage = async () => {
  const supabase = await createClient();
  const [user, products, subscription] = await Promise.all([
    getUser(supabase),
    getProducts(supabase),
    getSubscription(supabase),
  ]);

  if (!user) {
    redirect("/login?mode=signup");
  }

  return (
    <div className="custom-container mx-auto w-full">
      <PageHeader
        subtitle="Manage your subscription and billing information."
        title="Plans & Billing"
      />

      <div className="grid gap-10">
        <PlanSummary products={products || []} subscription={subscription} user={user} />
      </div>
    </div>
  );
};

export default BillingPage;
