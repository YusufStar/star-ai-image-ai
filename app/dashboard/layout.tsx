"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { Avatar, Button, ScrollShadow, Spacer, Tooltip, Skeleton, addToast } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@heroui/react";
import { usePathname } from "next/navigation";

import { Breadcrumb } from "./breadcumbs";

import { sectionItems } from "@/components/sidebar/sidebar-items";
import Sidebar from "@/components/sidebar/sidebar";
import { Logo } from "@/components/icons";
import { ThemeSwitch } from "@/components/theme-switch";
import { getUser, logout } from "@/actions/auth-actions";

interface UserData {
    name: string;
    email: string;
}

export default function Component({ children }: { children: ReactNode[] }) {
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const [isLoadingUserData, setIsLoadingUserData] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [userData, setUserData] = useState<UserData>({
        name: "Undefined Username",
        email: "Undefined Email"
    });
    const isMobile = useMediaQuery("(max-width: 768px)");
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
    }, []);

    const findActiveKey = () => {
        for (const section of sectionItems) {
            for (const item of section.items || []) {
                if (item.href === pathname) {
                    return item.key;
                }
                // Check nested items
                if (item.items) {
                    for (const subItem of item.items) {
                        if (subItem.href === pathname) {
                            return subItem.key;
                        }
                    }
                }
            }
        }

        return "home"; // fallback
    };

    const isCompact = mounted ? (isCollapsed || isMobile) : false;

    const onToggle = React.useCallback(() => {
        setIsCollapsed((prev) => !prev);
    }, []);

    const getUserData = async () => {
        try {
            setIsLoadingUserData(true);
            const { data: { user }, error } = await getUser();

            if (error) {
                return;
            }

            if (user) {
                setUserData({
                    name: user.user_metadata?.full_name || "Undefined Username",
                    email: user.email || "Undefined Email"
                });
            }
        } catch (error) {
            addToast({
                title: "Fetching user data error!",
                description: String(error),
                color: "danger"
            })
        } finally {
            setIsLoadingUserData(false);
        }
    };

    useEffect(() => {
        getUserData();
    }, []);

    return (
        <div className="flex h-screen w-full overflow-hidden">
            <div
                className={cn(
                    "relative h-full w-72 flex-none flex-col !border-r-small border-divider p-6 transition-width hidden sm:flex",
                    {
                        "w-16 items-center px-2 py-6": isCompact,
                    },
                )}
            >
                <div
                    className={cn(
                        "flex items-center gap-3 px-3",
                        {
                            "justify-center gap-0": isCompact,
                        },
                    )}
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground">
                        <Logo className="text-background" />
                    </div>
                    <span
                        className={cn("text-small font-bold uppercase opacity-100", {
                            "w-0 opacity-0": isCompact,
                        })}
                    >
                        Star AI
                    </span>
                </div>
                <Spacer y={8} />
                <div className="flex items-center gap-3 px-3">
                    {isLoadingUserData ? (
                        <Skeleton className="flex-none rounded-full">
                            <div className="h-8 w-8" />
                        </Skeleton>
                    ) : (
                        <Avatar
                            isBordered
                            className="flex-none"
                            name={userData.name}
                            size="sm"
                        />
                    )}
                    <div className={cn("flex max-w-full flex-col gap-1", { hidden: isCompact })}>
                        {isLoadingUserData ? (
                            <>
                                <Skeleton className="w-24 rounded-lg">
                                    <div className="h-3" />
                                </Skeleton>
                                <Skeleton className="w-32 rounded-lg">
                                    <div className="h-3" />
                                </Skeleton>
                            </>
                        ) : (
                            <>
                                <p className="truncate text-small font-medium text-default-600">
                                    {userData.name}
                                </p>
                                <p className="truncate text-tiny text-default-400">
                                    {userData.email}
                                </p>
                            </>
                        )}
                    </div>
                </div>
                <ScrollShadow className="-mr-6 h-full max-h-full py-6 pr-6">
                    <Sidebar isCompact={isCompact} items={sectionItems} selectedKey={findActiveKey()} />
                </ScrollShadow>
                <Spacer y={2} />
                <div
                    className={cn("mt-auto flex flex-col", {
                        "items-center": isCompact,
                    })}
                >
                    <Tooltip content="Help & Feedback" isDisabled={!isCompact} placement="right">
                        <Button
                            fullWidth
                            className={cn(
                                "justify-start truncate text-default-500 data-[hover=true]:text-foreground",
                                {
                                    "justify-center": isCompact,
                                },
                            )}
                            isIconOnly={isCompact}
                            startContent={
                                isCompact ? null : (
                                    <Icon
                                        className="flex-none text-default-500"
                                        icon="solar:info-circle-line-duotone"
                                        width={24}
                                    />
                                )
                            }
                            variant="light"
                        >
                            {isCompact ? (
                                <Icon
                                    className="text-default-500"
                                    icon="solar:info-circle-line-duotone"
                                    width={24}
                                />
                            ) : (
                                "Help & Information"
                            )}
                        </Button>
                    </Tooltip>
                    <Tooltip content="Log Out" isDisabled={!isCompact} placement="right">
                        <Button
                            className={cn("justify-start text-default-500 data-[hover=true]:text-foreground", {
                                "justify-center": isCompact,
                            })}
                            isIconOnly={isCompact}
                            startContent={
                                isCompact ? null : (
                                    <Icon
                                        className="flex-none rotate-180 text-default-500"
                                        icon="solar:minus-circle-line-duotone"
                                        width={24}
                                    />
                                )
                            }
                            variant="light"
                            onPress={() => logout()}
                        >
                            {isCompact ? (
                                <Icon
                                    className="rotate-180 text-default-500"
                                    icon="solar:minus-circle-line-duotone"
                                    width={24}
                                />
                            ) : (
                                "Log Out"
                            )}
                        </Button>
                    </Tooltip>
                </div>
            </div>
            <div className="flex-1 flex flex-col min-h-0 w-full p-4">
                <header className="container mx-auto !py-4 flex-none flex items-center gap-3 rounded-medium border-small border-divider">
                    {isMobile ? (
                        <Button isIconOnly size="sm" variant="light" onPress={onToggle}>
                            <Icon
                                className="text-default-500"
                                height={24}
                                icon="solar:hamburger-menu-broken"
                                width={24}
                            />
                        </Button>
                    ) : (
                        <Button isIconOnly size="sm" variant="light" onPress={onToggle}>
                            <Icon
                                className="text-default-500"
                                height={24}
                                icon="solar:sidebar-minimalistic-outline"
                                width={24}
                            />
                        </Button>
                    )}
                    {
                        !isMobile && <Breadcrumb pathname={pathname} />
                    }

                    <ThemeSwitch className="ml-auto" />
                </header>
                <main className="flex-1 min-h-0 pt-4">
                    <div className="h-full w-full flex flex-col gap-4 rounded-medium border-small border-divider overflow-y-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
