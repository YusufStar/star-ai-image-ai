import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useMediaQuery } from "usehooks-ts";

import { sectionItems } from "@/components/sidebar/sidebar-items";

// Breadcrumb verisini üret
const generateBreadcrumbs = (pathname: string) => {
    const paths = pathname.split("/").filter(Boolean); // ["dashboard", "train-model"]

    const breadcrumbs = paths.map((path, index) => {
        // İlk dizindeki "dashboard" için farklı bir başlık belirlemek isterseniz burada kontrol edebilirsiniz
        const href = "/" + paths.slice(0, index + 1).join("/");

        // sectionItems'tan başlığı bul
        let title = path;
        let icon = ""

        sectionItems.forEach((section) => {
            section.items?.forEach((item) => {
                if (item.href === href) {
                    icon = item.icon!
                    title = item.title;
                }
            });
        });

        return { href, title, icon };
    });

    return breadcrumbs;
};

export const Breadcrumb = ({ pathname }: { pathname: string }) => {
    const breadcrumbs = generateBreadcrumbs(pathname);
    const isMobile = useMediaQuery("(max-width: 768px)");

    const displayedBreadcrumbs = isMobile
        ? breadcrumbs.slice(-2)
        : breadcrumbs;

    return (
        <Breadcrumbs>
            {displayedBreadcrumbs.map((crumb) => (
                <BreadcrumbItem key={crumb.href}>
                    <Icon className="text-foreground-500" icon={crumb.icon} />
                    <Link href={crumb.href}>{crumb.title}</Link>
                </BreadcrumbItem>
            ))}
        </Breadcrumbs>
    );
};
