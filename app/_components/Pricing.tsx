"use client";

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Switch,
  Divider,
  addToast,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User } from "@supabase/supabase-js";
import { useRouter, usePathname } from "next/navigation";

import {
  renderPricingButton,
  ProductWithPrices,
  SubscriptionWithProduct,
} from "@/lib/utils/pricing";
import { Tables } from "@/database.type";
import { getErrorRedirect } from "@/lib/helpers";
import { getStripe } from "@/lib/stripe/client";
import { checkoutWithStripe, createStripePortal } from "@/lib/stripe/server";
type Product = Tables<"products">;
type Price = Tables<"prices">;

interface ProductWithPrice extends Product {
  prices: Price[];
}

export default function Pricing({
  products,
  user = null,
  subscription = null,
}: {
  products: ProductWithPrice[];
  user?: User | null;
  subscription?: SubscriptionWithProduct | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isYearly, setIsYearly] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
  const getPrice = (product: ProductWithPrice) => {
    const price = product.prices.find(
      (price) => price.interval === (isYearly ? "year" : "month")
    );

    return {
      formatted: price ? formatPrice(price.unit_amount || 0) : "$0",
      raw: price || null,
    };
  };

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
    addToast({
      title: "Stripe portal request",
      description: "Redirecting to Stripe portal",
      color: "primary",
      icon: "solar:info-circle-bold",
    });
    const redirectUrl = await createStripePortal(pathname);
    if (redirectUrl) {
      return router.push(redirectUrl);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    hover: {
      y: -8,
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  };

  if (!mounted) return null;

  return (
    <section
      className="flex flex-col w-full h-full py-8 sm:py-10 md:py-12"
      id="pricing"
    >
      <motion.div
        animate="visible"
        className="w-full container mx-auto px-4 md:px-6 flex flex-col items-center justify-center space-y-6 sm:space-y-10"
        initial="hidden"
        variants={containerVariants}
      >
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center text-center max-w-2xl"
          initial={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
        >
          <motion.span
            className="bg-primary/10 text-primary font-medium px-3 py-1 rounded-full text-xs inline-flex items-center gap-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon
              className="w-3 h-3 sm:w-3.5 sm:h-3.5"
              icon="solar:magic-stick-bold-duotone"
            />
            Pricing
          </motion.span>

          <motion.h2
            animate={{ opacity: 1 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold mt-3 mb-2"
            initial={{ opacity: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            Choose Your Plan
          </motion.h2>

          <motion.p
            animate={{ opacity: 1 }}
            className="text-foreground-600 text-xs sm:text-sm md:text-base"
            initial={{ opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Select the perfect plan to transform your ideas into stunning
            AI-generated images
          </motion.p>
        </motion.div>

        {/* Billing Switch */}
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 bg-content2/60 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm border border-border"
          initial={{ opacity: 0, scale: 0.95 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <span
            className={`text-xs sm:text-sm font-medium ${!isYearly ? "text-primary" : "text-foreground-600"}`}
          >
            Monthly
          </span>
          <Switch
            classNames={{
              wrapper: "group-data-[selected=true]:bg-primary",
            }}
            color="primary"
            isSelected={isYearly}
            size="sm"
            onValueChange={setIsYearly}
          />
          <span
            className={`text-xs sm:text-sm font-medium flex items-center gap-1.5 ${isYearly ? "text-primary" : "text-foreground-600"}`}
          >
            Yearly
          </span>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 w-full"
          variants={containerVariants}
        >
          {products
            .sort((a, b) => {
              const order = { "Hobby": 1, "Pro": 2, "Enterprise": 3 };
              return (order[a.name as keyof typeof order] || 99) - (order[b.name as keyof typeof order] || 99);
            })
            .map((product, index) => {
            const isPro = product.name === "Pro";
            const isEnterprise = product.name === "Enterprise";
            const priceInfo = getPrice(product);

            return (
              <motion.div
                key={product.id}
                className="h-full"
                variants={cardVariants}
                whileHover="hover"
              >
                <Card
                  className={`border h-full ${
                    isPro
                      ? "border-primary relative overflow-visible"
                      : "border-border"
                  }`}
                  shadow={isPro ? "md" : "sm"}
                >
                  {isPro && (
                    <motion.div
                      animate={{ y: 0, opacity: 1 }}
                      className="absolute -top-3 right-4 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm"
                      initial={{ y: -5, opacity: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      Popular
                    </motion.div>
                  )}

                  <CardHeader className="flex flex-col gap-1 pb-0 pt-3 sm:pt-4 px-3 sm:px-4">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Icon
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${
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
                      <h3 className="text-base sm:text-lg font-bold">
                        {product.name}
                      </h3>
                    </div>
                    <p className="text-foreground-600 text-xs">
                      {product.description?.split(".")[0] ||
                        "Flexible plan for your needs"}
                    </p>
                  </CardHeader>

                  <CardBody className="py-3 sm:py-4 px-3 sm:px-4">
                    <div className="flex items-baseline gap-1 mb-3 sm:mb-4">
                      <span className="text-2xl sm:text-3xl font-bold">
                        {priceInfo.formatted}
                      </span>
                      <span className="text-foreground-600 text-xs sm:text-sm">
                        /{isYearly ? "year" : "month"}
                      </span>
                    </div>

                    <Divider className="my-3" />

                    <ul className="space-y-2.5 mt-3">
                      {product.metadata &&
                        typeof product.metadata === "object" &&
                        Object.entries(
                          product.metadata as Record<string, string>
                        ).map(([key, feature]) => (
                          <li key={key} className="flex items-start gap-2">
                            <Icon
                              className={`w-4 h-4 mt-0.5 ${
                                isPro
                                  ? "text-primary"
                                  : isEnterprise
                                    ? "text-warning"
                                    : "text-success"
                              }`}
                              icon="solar:check-circle-bold"
                            />
                            <span className="text-foreground-700 text-sm">
                              {feature}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </CardBody>

                  <CardFooter className="pt-0 pb-4 px-4">
                    {renderPricingButton({
                      subscription,
                      user,
                      product: product as unknown as ProductWithPrices,
                      price: priceInfo.raw,
                      handleStripeCheckout,
                      handleStripePortalRequest,
                      variant: "full",
                      isPro,
                      isEnterprise,
                    })}
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Additional Info Section - More compact */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-3xl bg-gradient-to-br from-content1/40 to-content1/20 backdrop-blur-md p-6 rounded-2xl shadow-md border border-border/50 mt-8"
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/10 p-2 rounded-full">
              <Icon
                className="w-5 h-5 text-primary"
                icon="solar:info-circle-bold"
              />
            </div>
            <h3 className="text-base font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              All plans include
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3">
            {[
              "AI image generation",
              "Regular updates",
              "Cloud storage",
              "Cross-device access",
              "User-friendly interface",
              "Community access",
            ].map((feature, i) => (
              <motion.div
                key={i}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 group"
                initial={{ opacity: 0, x: -10 }}
                transition={{ delay: 0.9 + i * 0.1, duration: 0.4 }}
                whileHover={{ x: 3 }}
              >
                <div className="bg-success/10 p-1 rounded-full group-hover:bg-success/20 transition-colors">
                  <Icon
                    className="w-3.5 h-3.5 text-success"
                    icon="solar:check-circle-bold"
                  />
                </div>
                <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                  {feature}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
