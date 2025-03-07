"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Progress,
  Divider,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { User } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { format } from "date-fns";

import PricingSheet from "./PricingSheet";

import { Tables } from "@/database.type";

type Product = Tables<"products">;
type Subscription = Tables<"subscriptions">;
type Price = Tables<"prices">;

interface ProductWithPrices extends Product {
  prices: Price[];
}

interface PriceWithProduct extends Price {
  products: Product | null;
}

interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct;
}

interface PlanSummaryProps {
  subscription: SubscriptionWithProduct | null;
  user: User | null;
  products: ProductWithPrices[] | null;
  credits: Tables<"credits"> | null;
}

export default function PlanSummary({
  subscription,
  products,
  user,
  credits,
}: PlanSummaryProps) {
  if (!subscription || subscription.status !== "active") {
    return (
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-5xl overflow-hidden border border-default-200 shadow-lg">
          <CardHeader className="flex items-center gap-2 bg-gradient-to-r from-default-100 to-default-50 px-6 py-4">
            <Icon
              className="text-xl text-default-500"
              icon="solar:info-circle-linear"
            />
            <span className="text-lg font-semibold">
              No Active Subscription
            </span>
          </CardHeader>

          <CardBody className="px-6 py-5">
            <div className="mb-6">
              <motion.div
                animate={{ x: 0 }}
                className="flex items-center gap-2 mb-4"
                initial={{ x: -20 }}
                transition={{ delay: 0.1 }}
              >
                <Icon className="text-xl text-warning" icon="solar:star-bold" />
                <h3 className="text-md font-medium">
                  Upgrade to unlock premium features
                </h3>
              </motion.div>

              <p className="text-sm text-default-500 ml-7">
                Get access to advanced features and increase your usage limits
                with a premium plan.
              </p>
            </div>

            <Divider className="my-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                animate={{ opacity: 1 }}
                className="space-y-4"
                initial={{ opacity: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon
                    className="text-lg text-primary"
                    icon="solar:gallery-linear"
                  />
                  <h4 className="text-sm font-medium">Image Generation</h4>
                  <Chip
                    className="ml-auto"
                    color="danger"
                    size="sm"
                    variant="flat"
                  >
                    Free tier
                  </Chip>
                </div>

                <div className="space-y-2">
                  <div className="flex-1 text-xs flex w-full justify-between pb-1">
                    <span className="font-normal text-default-500">
                      Credits remaining
                    </span>
                    <span className="font-medium">0 / 0</span>
                  </div>

                  <div className="flex items-end">
                    <Progress
                      aria-label="Image generation credits"
                      className="w-full h-2"
                      color="primary"
                      value={0}
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ opacity: 1 }}
                className="space-y-4"
                initial={{ opacity: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon
                    className="text-lg text-primary"
                    icon="solar:settings-linear"
                  />
                  <h4 className="text-sm font-medium">Model Training</h4>
                  <Chip
                    className="ml-auto"
                    color="danger"
                    size="sm"
                    variant="flat"
                  >
                    Free tier
                  </Chip>
                </div>

                <div className="space-y-2">
                  <div className="flex-1 text-xs flex w-full justify-between pb-1">
                    <span className="font-normal text-default-500">
                      Credits remaining
                    </span>
                    <span className="font-medium">0 / 0</span>
                  </div>

                  <div className="flex items-end">
                    <Progress
                      aria-label="Model training credits"
                      className="w-full h-2"
                      color="primary"
                      value={0}
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 p-4 rounded-lg bg-default-50 border border-default-200"
              initial={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-start gap-3">
                <Icon
                  className="text-xl text-warning mt-0.5"
                  icon="solar:lightbulb-linear"
                />
                <div>
                  <h4 className="text-sm font-medium mb-1">Pro Tip</h4>
                  <p className="text-xs text-default-500">
                    Upgrade to our premium plan to get unlimited image
                    generations, priority support, and advanced model training
                    capabilities.
                  </p>
                </div>
              </div>
            </motion.div>
          </CardBody>

          <CardFooter className="flex justify-end gap-2 border-t border-default-200 px-6 py-4 bg-default-50">
            <Button
              size="sm"
              startContent={<Icon icon="solar:info-circle-linear" />}
              variant="flat"
            >
              Learn More
            </Button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <PricingSheet
                products={products}
                subscription={subscription}
                user={user}
              />
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  const {
    products: subscriptionProduct,
    unit_amount,
    currency,
  } = subscription.prices;

  const priceString = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency!,
    minimumFractionDigits: 0,
  }).format((unit_amount || 0) / 100);

  const imageGenCount = credits?.image_generation_count || 0;
  const modelTrainingCount = credits?.model_training_count || 0;
  const maxImageGenCount = credits?.max_image_generation_count || 0;
  const maxModelTrainingCount = credits?.max_model_training_count || 0;

  console.log({
    subscriptionProduct,
    unit_amount,
    currency,
    priceString,
    imageGenCount,
    modelTrainingCount,
    maxImageGenCount,
    maxModelTrainingCount,
  });

  // Calculate the renewal date (assuming it's 1 month from the current period start)
  const startDate = format(
    new Date(subscription.current_period_start),
    "MMM d, yyyy"
  );
  const endDate = format(
    new Date(subscription.current_period_end),
    "MMM d, yyyy"
  );

  // Determine if the subscription is Pro or Enterprise
  const isPro = subscriptionProduct?.name === "Pro";
  const isEnterprise = subscriptionProduct?.name === "Enterprise";

  // Calculate usage percentages
  const imageGenPercentage =
    Number(maxImageGenCount) > 0
      ? Math.min(100, (Number(imageGenCount) / Number(maxImageGenCount)) * 100)
      : (Number(imageGenCount) / 300) * 100; // Fallback to 300 if max not set

  const modelTrainingPercentage =
    Number(maxModelTrainingCount) > 0
      ? Math.min(
          100,
          (Number(modelTrainingCount) / Number(maxModelTrainingCount)) * 100
        )
      : (Number(modelTrainingCount) / 2) * 100; // Fallback to 2 if max not set

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="max-w-5xl overflow-hidden border border-default-200 shadow-lg">
        <CardHeader className="flex items-center justify-between bg-gradient-to-r from-default-100 to-default-50 px-6 py-4">
          <div className="flex items-center gap-2">
            <Icon
              className={`text-xl ${
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
            <span className="text-lg font-semibold">Current Plan</span>
          </div>
          <Chip
            color={isPro ? "primary" : isEnterprise ? "warning" : "success"}
            size="sm"
            variant="flat"
          >
            {subscription.status.toUpperCase()}
          </Chip>
        </CardHeader>

        <CardBody className="px-6 py-5">
          <div className="mb-6">
            <motion.div
              animate={{ x: 0 }}
              className="flex items-center gap-2 mb-4"
              initial={{ x: -20 }}
              transition={{ delay: 0.1 }}
            >
              <Icon
                className={`text-xl ${
                  isPro
                    ? "text-primary"
                    : isEnterprise
                      ? "text-warning"
                      : "text-success"
                }`}
                icon={
                  isEnterprise
                    ? "solar:crown-bold"
                    : isPro
                      ? "solar:star-bold"
                      : "solar:user-id-bold"
                }
              />
              <h3 className="text-md font-medium">
                {subscriptionProduct?.name || "Basic"} Plan
              </h3>
              <div className="flex items-baseline gap-1 ml-auto">
                <span className="text-base font-bold">{priceString}</span>
                <span className="text-default-500 text-xs">
                  /{subscription.prices.interval || "month"}
                </span>
              </div>
            </motion.div>

            <p className="text-sm text-default-500 ml-7 mb-4">
              {subscriptionProduct?.description ||
                "Your current subscription plan"}
            </p>

            <div className="ml-7 flex items-center gap-2 text-xs text-default-600">
              <Icon className="text-primary" icon="solar:calendar-mark-bold" />
              <span>Started on {startDate}</span>
            </div>
            <div className="ml-7 flex items-center gap-2 text-xs text-default-600">
              <Icon className="text-success" icon="solar:calendar-mark-bold" />
              <span>Renews on {endDate}</span>
            </div>
          </div>

          <Divider className="my-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              animate={{ opacity: 1 }}
              className="space-y-4"
              initial={{ opacity: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon
                  className="text-lg text-primary"
                  icon="solar:gallery-linear"
                />
                <h4 className="text-sm font-medium">Image Generation</h4>
                <Chip
                  className="ml-auto"
                  color={
                    isPro ? "primary" : isEnterprise ? "warning" : "success"
                  }
                  size="sm"
                  variant="flat"
                >
                  {subscriptionProduct?.name || "Basic"}
                </Chip>
              </div>

              <div className="space-y-2">
                <div className="flex-1 text-xs flex w-full justify-between pb-1">
                  <span className="font-normal text-default-500">
                    Credits used
                  </span>
                  <span className="font-medium">
                    {imageGenCount} / {maxImageGenCount || 300}
                  </span>
                </div>

                <div className="flex items-end">
                  <Progress
                    aria-label="Image generation credits"
                    className="w-full h-2"
                    color={imageGenPercentage > 80 ? "danger" : "primary"}
                    value={imageGenPercentage}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ opacity: 1 }}
              className="space-y-4"
              initial={{ opacity: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon
                  className="text-lg text-primary"
                  icon="solar:settings-linear"
                />
                <h4 className="text-sm font-medium">Model Training</h4>
                <Chip
                  className="ml-auto"
                  color={
                    isPro ? "primary" : isEnterprise ? "warning" : "success"
                  }
                  size="sm"
                  variant="flat"
                >
                  {subscriptionProduct?.name || "Basic"}
                </Chip>
              </div>

              <div className="space-y-2">
                <div className="flex-1 text-xs flex w-full justify-between pb-1">
                  <span className="font-normal text-default-500">
                    Credits used
                  </span>
                  <span className="font-medium">
                    {modelTrainingCount} / {maxModelTrainingCount || 2}
                  </span>
                </div>

                <div className="flex items-end">
                  <Progress
                    aria-label="Model training credits"
                    className="w-full h-2"
                    color={modelTrainingPercentage > 80 ? "danger" : "primary"}
                    value={modelTrainingPercentage}
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {subscriptionProduct?.metadata && (
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 p-4 rounded-lg bg-default-50 border border-default-200"
              initial={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: 0.4 }}
            >
              <h4 className="text-sm font-medium mb-3">Plan Features</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {typeof subscriptionProduct.metadata === "object" &&
                  !Array.isArray(subscriptionProduct.metadata) &&
                  Object.entries(
                    subscriptionProduct.metadata as Record<string, string>
                  ).map(([key, feature]) => (
                    <div key={key} className="flex items-start gap-1.5">
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
            </motion.div>
          )}
        </CardBody>

        <CardFooter className="flex flex-col-reverse gap-2 sm:flex-row justify-between items-center border-t border-default-200 px-6 py-4 bg-default-50">
          <div className="flex items-center gap-2">
            <Icon
              className={`text-sm ${
                isPro
                  ? "text-primary"
                  : isEnterprise
                    ? "text-warning"
                    : "text-success"
              }`}
              icon="solar:info-circle-bold"
            />
            <span className="text-xs text-default-600">
              {isPro
                ? "You're on the Pro plan"
                : isEnterprise
                  ? "You're on the Enterprise plan"
                  : "You're on the Basic plan"}
            </span>
          </div>
          <div className="flex gap-2">
            <PricingSheet
              products={products}
              subscription={subscription}
              user={user}
            />
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
