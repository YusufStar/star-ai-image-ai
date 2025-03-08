import { redirect } from "next/navigation";

import PlanSummary from "./_components/PlanSummary";

import { getSubscription, getProducts, getUser } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/header";
import { getCredits } from "@/actions/credit-actions";

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

  const credits = await getCredits();

  return (
    <div className="custom-container mx-auto w-full">
      <PageHeader
        subtitle="Manage your subscription and billing information."
        title="Plans & Billing"
      />

      <PlanSummary
        credits={credits.data}
        products={products || []}
        subscription={subscription}
        user={user}
      />
    </div>
  );
};

export default BillingPage;
