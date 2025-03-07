"use client";

import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { User } from "@supabase/supabase-js";

import { Tables } from "@/database.type";

type Product = Tables<"products">;
type Subscription = Tables<"subscriptions">;
type Price = Tables<"prices">;

export interface ProductWithPrices extends Product {
  prices: Price[];
}

export interface PriceWithProduct extends Price {
  products: Product | null;
}

export interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct;
}

export interface RenderPricingButtonProps {
  subscription: SubscriptionWithProduct | null;
  user: User | null;
  product: ProductWithPrices | null;
  price: Price | null;
  handleStripeCheckout: (price: Price) => Promise<any>;
  handleStripePortalRequest: () => Promise<any>;
  variant?: "compact" | "full";
  isPro?: boolean;
  isEnterprise?: boolean;
}

export const renderPricingButton = ({
  subscription,
  user,
  product,
  price,
  handleStripeCheckout,
  handleStripePortalRequest,
  variant = "compact",
  isPro = false,
  isEnterprise = false,
}: RenderPricingButtonProps) => {
  if (variant === "full") {
    return (
      <Button
        className="w-full"
        color={isPro ? "primary" : isEnterprise ? "warning" : "default"}
        radius="full"
        size="md"
        startContent={
          <Icon
            className="w-3.5 h-3.5"
            icon={isPro ? "solar:bolt-bold" : "solar:arrow-right-bold"}
          />
        }
        variant={isPro ? "solid" : "bordered"}
        onPress={async () => {
          if (user && price) {
            await handleStripeCheckout(price);
          } else if (user && subscription && subscription.status === "active") {
            await handleStripePortalRequest();
          }
        }}
      >
        {isPro ? "Get Started" : isEnterprise ? "Choose Plan" : "Choose Plan"}
      </Button>
    );
  }

  if (user && !subscription) {
    return (
      <Button
        fullWidth
        color="primary"
        size="sm"
        startContent={<Icon className="text-xs" icon="solar:bolt-linear" />}
        onClick={() => price && handleStripeCheckout(price)}
      >
        Subscribe
      </Button>
    );
  }

  if (user && subscription && subscription.status === "active") {
    // Check if this is the current plan or a different plan
    const isCurrentPlan = subscription.prices.products?.id === product?.id;

    return (
      <Button
        fullWidth
        size="sm"
        color={isCurrentPlan ? "default" : "primary"}
        startContent={
          <Icon
            className="text-xs"
            icon={
              isCurrentPlan ? "solar:settings-linear" : "solar:refresh-linear"
            }
          />
        }
        variant={isCurrentPlan ? "bordered" : "solid"}
        onClick={() => {
          if (isCurrentPlan) {
            handleStripePortalRequest();
          } else if (price) {
            handleStripeCheckout(price);
          }
        }}
      >
        {isCurrentPlan ? "Manage" : "Switch"}
      </Button>
    );
  }

  return null;
};
