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
} from "@heroui/react";
import { User } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

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
}

export default function PlanSummary({
  subscription,
  products,
  user,
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
                    <span className="font-medium">0 / 10</span>
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
                    <span className="font-medium">0 / 5</span>
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

  console.log({
    subscriptionProduct,
    unit_amount,
    currency,
    priceString,
  });

  return <div>Plan Card</div>;
}
