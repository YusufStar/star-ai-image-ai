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
  prices: PriceWithProduct[];
}

export interface RenderPricingButtonProps {
  subscription: SubscriptionWithProduct | null;
  user: User | null;
  product: ProductWithPrices | null;
  price: Price | null;
  handleStripeCheckout: (price: Price) => Promise<any>;
  handleStripePortalRequest: () => Promise<string>;
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
        onClick={() => {
          if (user && price) {
            handleStripeCheckout(price);
          } else if (user && subscription && subscription.status === "active") {
            handleStripePortalRequest();
          }
        }}
      >
        {isPro
          ? "Get Started"
          : isEnterprise
            ? "Contact Sales"
            : "Choose Plan"}
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
    return (
      <Button
        fullWidth
        size="sm"
        startContent={<Icon className="text-xs" icon="solar:settings-linear" />}
        variant="bordered"
        onClick={() => handleStripePortalRequest()}
      >
        Manage
      </Button>
    );
  }

  return null;
}; 