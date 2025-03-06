"use client";

import React from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Button,
  Chip,
  Divider,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

const features = [
  {
    title: "AI Image Generation",
    description:
      "Create stunning images with our advanced AI models in seconds",
    icon: "solar:magic-stick-bold-duotone",
    color: "primary",
    delay: 0.1,
    details: ["Multiple art styles", "Custom dimensions", "Prompt assistance"],
  },
  {
    title: "Style Customization",
    description: "Choose from dozens of artistic styles to match your vision",
    icon: "solar:palette-bold-duotone",
    color: "secondary",
    delay: 0.2,
    details: ["Photorealistic", "Anime", "Oil painting", "Watercolor"],
  },
  {
    title: "High Resolution",
    description: "Generate high-quality images suitable for professional use",
    icon: "solar:resolution-bold-duotone",
    color: "success",
    delay: 0.3,
    details: ["Up to 4K resolution", "Print-ready quality", "Lossless formats"],
  },
  {
    title: "Prompt Library",
    description:
      "Access our curated library of effective prompts for best results",
    icon: "solar:book-bold-duotone",
    color: "warning",
    delay: 0.4,
    details: ["Categorized prompts", "Community favorites", "Prompt builder"],
  },
  {
    title: "Batch Processing",
    description:
      "Create multiple variations of your images in a single request",
    icon: "solar:layers-bold-duotone",
    color: "danger",
    delay: 0.5,
    details: ["Up to 10 variations", "Bulk generation", "Comparison view"],
  },
  {
    title: "Cloud Storage",
    description: "Securely store and organize all your generated images",
    icon: "solar:cloud-bold-duotone",
    color: "info",
    delay: 0.6,
    details: ["Unlimited storage", "Folders & tags", "One-click sharing"],
  },
];

const technologies = [
  { name: "Stable Diffusion", icon: "solar:code-bold-duotone" },
  { name: "DALL-E", icon: "solar:square-academic-cap-bold-duotone" },
  { name: "Midjourney", icon: "solar:stars-minimalistic-bold-duotone" },
  { name: "GPT-4", icon: "solar:chat-square-code-bold-duotone" },
];

// Helper function to get the appropriate color classes based on the color name
const getColorClasses = (colorName: string) => {
  const colorMap = {
    primary: {
      text: "text-primary",
      bg: "bg-primary/10",
    },
    secondary: {
      text: "text-secondary",
      bg: "bg-secondary/10",
    },
    success: {
      text: "text-success",
      bg: "bg-success/10",
    },
    warning: {
      text: "text-warning",
      bg: "bg-warning/10",
    },
    danger: {
      text: "text-danger",
      bg: "bg-danger/10",
    },
    info: {
      text: "text-info",
      bg: "bg-info/10",
    },
  };

  return colorMap[colorName as keyof typeof colorMap] || { text: "text-primary", bg: "bg-primary/10" };
};

export default function Features() {
  return (
    <section
      className="w-full py-12 sm:py-16 md:py-20 bg-gradient-to-b from-background to-content1/5"
      id="features"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-8 sm:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Chip
              className="mb-3"
              color="primary"
              size="sm"
              startContent={
                <Icon
                  className="text-primary text-sm"
                  icon="solar:star-bold-duotone"
                />
              }
              variant="flat"
            >
              Features
            </Chip>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
              Powerful AI Image Generation
            </h2>
            <p className="text-foreground-600 max-w-2xl mx-auto text-sm sm:text-base">
              Our platform offers cutting-edge features to transform your ideas
              into stunning visuals with just a few clicks
            </p>
          </motion.div>
        </div>

        <motion.div
          className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-10"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="w-full max-w-2xl bg-content1/30 backdrop-blur-sm p-2 sm:p-3 rounded-xl border border-border flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            <span className="text-xs sm:text-sm font-medium text-foreground-600">
              Powered by:
            </span>
            {technologies.map((tech, index) => (
              <Chip
                key={index}
                className="bg-background/80 text-xs sm:text-sm"
                size="sm"
                startContent={<Icon className="text-sm" icon={tech.icon} />}
                variant="flat"
              >
                {tech.name}
              </Chip>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => {
            const colorClasses = getColorClasses(feature.color);

            return (
              <motion.div
                key={index}
                className="h-full"
                initial={{ opacity: 0, y: 20 }}
                transition={{ delay: feature.delay, duration: 0.5 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <Card
                  isHoverable
                  className="border border-border h-full shadow-sm"
                >
                  <CardBody className="p-4 sm:p-5">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-3 sm:mb-4 ${colorClasses.bg}`}
                    >
                      <Icon
                        className={`${colorClasses.text} text-xl sm:text-2xl`}
                        icon={feature.icon}
                      />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-foreground-600 text-xs sm:text-sm mb-3 sm:mb-4">
                      {feature.description}
                    </p>

                    <Divider className="my-2 sm:my-3" />

                    <ul className="mt-2 sm:mt-3 space-y-1 sm:space-y-2">
                      {feature.details.map((detail, i) => (
                        <li key={i} className="flex items-center gap-1 sm:gap-2">
                          <Icon
                            className={`${colorClasses.text} text-xs sm:text-sm`}
                            icon="solar:check-circle-line"
                          />
                          <span className="text-xs sm:text-sm text-foreground-500">
                            {detail}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardBody>
                  <CardFooter className="px-4 sm:px-5 py-2 sm:py-3 border-t border-border/50 flex justify-end">
                    <Button
                      className="text-xs sm:text-sm"
                      color={
                        feature.color as
                          | "primary"
                          | "secondary"
                          | "success"
                          | "warning"
                          | "danger"
                          | "default"
                          | undefined
                      }
                      endContent={<Icon icon="solar:arrow-right-bold" />}
                      radius="full"
                      size="sm"
                      variant="light"
                    >
                      Learn more
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="mt-8 sm:mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <Button
            className="font-medium px-8"
            color="primary"
            radius="full"
            size="lg"
            startContent={
              <Icon className="text-lg" icon="solar:magic-stick-bold-duotone" />
            }
            variant="shadow"
          >
            Try All Features
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
