"use client";

import {
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Switch,
} from "@heroui/react";
import { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { usePathname, useRouter } from "next/navigation";

import {
  renderPricingButton,
  ProductWithPrices,
  SubscriptionWithProduct,
} from "@/lib/utils/pricing";
import { Tables } from "@/database.type";
import { checkoutWithStripe } from "@/lib/stripe/server";
import { getErrorRedirect } from "@/lib/helpers";
import { getStripe } from "@/lib/stripe/client";

type Price = Tables<"prices">;

// Default features to display if metadata is empty or not available
const defaultFeatures: string[] = [
  "Basic image generation",
  "Standard quality",
  "Community support",
  "Basic analytics",
  "1 model training",
  "Standard resolution",
];

interface PlanSummaryProps {
  subscription: SubscriptionWithProduct | null;
  user: User | null;
  products: ProductWithPrices[] | null;
}

const PricingSheet = ({ subscription, user, products }: PlanSummaryProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isYearly, setIsYearly] = useState(false);
  const [billingInterval, setBillingInterval] = useState<"month" | "year">(
    "month"
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setBillingInterval(isYearly ? "year" : "month");
  }, [isYearly]);

  const handleStripeCheckout = async (price: Price) => {
    if (!user) {
      return router.push("/login?mode=register");
    }

    const { errorRedirect, sessionId } = await checkoutWithStripe(
      price,
      pathname
    );

    if (errorRedirect) {
      return router.push(errorRedirect);
    }

    if (!sessionId) {
      return router.push(
        getErrorRedirect(
          pathname,
          "An unknown error occurred",
          "Please try again later or contact us."
        )
      );
    }
    const stripe = await getStripe();

    await stripe?.redirectToCheckout({ sessionId: sessionId as string });
  };

  const handleStripePortalRequest = async () => {
    return "Stripe portal request";
  };

  // Format price using Intl.NumberFormat for proper currency formatting
  const formatPrice = (price: number) => {
    const priceString = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format((price || 0) / 100);

    return priceString;
  };

  // Get the appropriate price based on billing interval
  const getPrice = (product: ProductWithPrices) => {
    const price = product.prices.find(
      (price) => price.interval === billingInterval
    );

    return price
      ? {
          formatted: formatPrice(price.unit_amount || 0),
          raw: price,
        }
      : {
          formatted: "$0",
          raw: null,
        };
  };

  if (!mounted) return null;

  return (
    <>
      <Button
        color="primary"
        size="sm"
        startContent={<Icon icon="solar:star-bold" />}
        onClick={() => setIsOpen(true)}
      >
        Upgrade Plan
      </Button>

      <Drawer
        classNames={{
          base: "bg-background",
          header: "border-b border-divider py-3",
          body: "px-0",
          footer: "border-t border-divider py-3",
        }}
        isOpen={isOpen}
        placement="right"
        size="lg"
        onClose={() => setIsOpen(false)}
      >
        <DrawerContent>
          <DrawerHeader className="flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold">Choose Your Plan</span>
            </div>
          </DrawerHeader>

          <DrawerBody className="overflow-y-auto px-4 py-4">
            <div className="flex items-center gap-2 bg-default-100 rounded-full px-2 py-1 mx-auto">
              <span
                className={`text-xs ${!isYearly ? "text-primary font-medium" : "text-default-600"}`}
              >
                Monthly
              </span>
              <Switch
                color="primary"
                isSelected={isYearly}
                size="sm"
                onValueChange={setIsYearly}
              />
              <span
                className={`text-xs flex items-center gap-1 ${isYearly ? "text-primary font-medium" : "text-default-600"}`}
              >
                Yearly
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {products &&
                products.map((product, index) => {
                  const isPro = product.name === "Pro";
                  const isEnterprise = product.name === "Enterprise";
                  const priceInfo = getPrice(product);

                  return (
                    <motion.div
                      key={product.id}
                      animate={{ opacity: 1, y: 0 }}
                      initial={{ opacity: 0, y: 10 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        className={`border w-full shadow-sm ${
                          isPro ? "border-primary" : "border-default-200"
                        }`}
                      >
                        <CardHeader className="flex justify-between items-center py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Icon
                              className={`w-4 h-4 ${
                                isPro
                                  ? "text-primary"
                                  : isEnterprise
                                    ? "text-warning"
                                    : "text-success"
                              }`}
                              icon={
                                isEnterprise
                                  ? "solar:crown-bold-duotone"
                                  : isPro
                                    ? "solar:star-bold-duotone"
                                    : "solar:user-id-bold-duotone"
                              }
                            />
                            <div>
                              <h3 className="text-sm font-semibold flex items-center gap-2">
                                {product.name}
                                {isPro && (
                                  <div className="text-xs text-primary font-medium">
                                    Popular
                                  </div>
                                )}
                              </h3>
                            </div>
                          </div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-base font-bold">
                              {priceInfo.formatted}
                            </span>
                            <span className="text-default-500 text-xs">
                              /{billingInterval}
                            </span>
                          </div>
                        </CardHeader>

                        <Divider />

                        <CardBody className="py-3 px-4">
                          <p className="text-xs text-default-600 mb-3">
                            {product.description?.split(".")[0] ||
                              "Flexible plan for your needs"}
                          </p>

                          <div className="grid grid-cols-2 gap-2">
                            {product.metadata && (
                              <>
                                {/* Handle if metadata is an object with numbered keys */}
                                {typeof product.metadata === "object" &&
                                  !Array.isArray(product.metadata) &&
                                  Object.entries(
                                    product.metadata as Record<string, string>
                                  )
                                    .slice(0, 6)
                                    .map(([key, feature]) => (
                                      <div
                                        key={key}
                                        className="flex items-start gap-1.5"
                                      >
                                        <Icon
                                          className={`w-3 h-3 mt-0.5 ${
                                            isPro
                                              ? "text-primary"
                                              : isEnterprise
                                                ? "text-warning"
                                                : "text-success"
                                          }`}
                                          icon="solar:check-circle-bold"
                                        />
                                        <span className="text-default-700 text-xs">
                                          {feature}
                                        </span>
                                      </div>
                                    ))}

                                {/* Handle if metadata is an array */}
                                {Array.isArray(product.metadata) &&
                                  product.metadata
                                    .slice(0, 6)
                                    .map((feature, index) => (
                                      <div
                                        key={index}
                                        className="flex items-start gap-1.5"
                                      >
                                        <Icon
                                          className={`w-3 h-3 mt-0.5 ${
                                            isPro
                                              ? "text-primary"
                                              : isEnterprise
                                                ? "text-warning"
                                                : "text-success"
                                          }`}
                                          icon="solar:check-circle-bold"
                                        />
                                        <span className="text-default-700 text-xs">
                                          {typeof feature === "string"
                                            ? feature
                                            : JSON.stringify(feature)}
                                        </span>
                                      </div>
                                    ))}

                                {/* If no features are found, show default features */}
                                {((typeof product.metadata === "object" &&
                                  !Array.isArray(product.metadata) &&
                                  Object.keys(product.metadata).length === 0) ||
                                  (Array.isArray(product.metadata) &&
                                    product.metadata.length === 0)) &&
                                  defaultFeatures.map((feature, index) => (
                                    <div
                                      key={index}
                                      className="flex items-start gap-1.5"
                                    >
                                      <Icon
                                        className={`w-3 h-3 mt-0.5 ${
                                          isPro
                                            ? "text-primary"
                                            : isEnterprise
                                              ? "text-warning"
                                              : "text-success"
                                        }`}
                                        icon="solar:check-circle-bold"
                                      />
                                      <span className="text-default-700 text-xs">
                                        {feature}
                                      </span>
                                    </div>
                                  ))}
                              </>
                            )}

                            {/* If metadata is null or undefined, show default features */}
                            {!product.metadata &&
                              defaultFeatures.map((feature, index) => (
                                <div
                                  key={index}
                                  className="flex items-start gap-1.5"
                                >
                                  <Icon
                                    className={`w-3 h-3 mt-0.5 ${
                                      isPro
                                        ? "text-primary"
                                        : isEnterprise
                                          ? "text-warning"
                                          : "text-success"
                                    }`}
                                    icon="solar:check-circle-bold"
                                  />
                                  <span className="text-default-700 text-xs">
                                    {feature}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </CardBody>

                        <CardFooter className="py-3 px-4">
                          {renderPricingButton({
                            subscription,
                            user,
                            product,
                            price: priceInfo.raw,
                            handleStripeCheckout,
                            handleStripePortalRequest,
                            variant: "compact",
                            isPro,
                            isEnterprise,
                          })}
                        </CardFooter>
                      </Card>
                    </motion.div>
                  );
                })}
            </div>
          </DrawerBody>

          <DrawerFooter className="flex justify-between items-center px-4">
            <div className="flex items-center gap-1.5 text-xs text-default-500">
              <Icon
                className="text-success w-3 h-3"
                icon="solar:shield-check-bold"
              />
              Secure payment with Stripe
            </div>
            <Button
              color="danger"
              size="sm"
              variant="light"
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default PricingSheet;
