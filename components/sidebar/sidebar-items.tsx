
import {type SidebarItem } from "./sidebar";

export const sectionItems: SidebarItem[] = [
  {
    key: "main",
    title: "Main",
    items: [
      {
        key: "dashboard",
        href: "/dashboard",
        icon: "solar:home-2-linear",
        title: "Dashboard",
      },
      {
        key: "generate-image",
        href: "/dashboard/generate-image",
        icon: "solar:magic-stick-linear",
        title: "Generate Image",
      },
      {
        key: "my-models",
        href: "/dashboard/my-models",
        icon: "solar:widget-2-outline",
        title: "My Models",
      },
      {
        key: "train-model",
        href: "/dashboard/train-model",
        icon: "solar:chart-2-linear",
        title: "Train Model",
      },
      {
        key: "my-images",
        href: "/dashboard/my-images",
        icon: "solar:gallery-linear",
        title: "My Images",
      },
      {
        key: "billing",
        href: "/dashboard/billing",
        icon: "solar:card-outline",
        title: "Billing",
      },
      {
        key: "settings",
        href: "/dashboard/settings",
        icon: "solar:settings-outline",
        title: "Settings",
      },
    ],
  },
];
