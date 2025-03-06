"use client";

import React, { useEffect, useState } from "react";
import { 
  Drawer, 
  DrawerContent, 
  DrawerBody,
  Button, 
  Avatar, 
  Spacer, 
  ScrollShadow,
  Skeleton
} from "@heroui/react";
import { Icon } from "@iconify/react";

import Sidebar from "./sidebar";
import { sectionItems } from "./sidebar-items";

import { Logo } from "@/components/icons";
import { logout } from "@/actions/auth-actions";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeKey: string;
  userData: {
    name: string;
    email: string;
  };
  isLoadingUserData: boolean;
}

export default function MobileSidebar({
  isOpen,
  onClose,
  activeKey,
  userData,
  isLoadingUserData
}: MobileSidebarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Drawer 
      hideCloseButton 
      classNames={{
        base: "m-0 h-full w-[85%] max-w-[300px] rounded-r-large rounded-l-none",
        wrapper: "items-start justify-start"
      }}
      isOpen={isOpen}
      placement="left"
      size="xs"
      onClose={onClose}
    >
      <DrawerContent>
        <DrawerBody className="p-0">
          <div className="flex h-full flex-col p-6">
            {/* Header with Logo */}
            <div className="flex items-center gap-3 px-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground">
                <Logo className="text-background" />
              </div>
              <span className="text-small font-bold uppercase">
                Star AI
              </span>
              <Button 
                isIconOnly 
                className="ml-auto" 
                size="sm" 
                variant="light"
                onPress={onClose}
              >
                <Icon
                  className="text-default-500"
                  icon="solar:close-circle-line-duotone"
                  width={24}
                />
              </Button>
            </div>
            
            <Spacer y={8} />
            
            {/* User Profile */}
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
              <div className="flex max-w-full flex-col gap-1">
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
            
            {/* Navigation */}
            <ScrollShadow className="h-full max-h-full py-6">
              <Sidebar isCompact={false} items={sectionItems} selectedKey={activeKey} />
            </ScrollShadow>
            
            <Spacer y={2} />
            
            {/* Footer Buttons */}
            <div className="mt-auto flex flex-col">
              <Button
                fullWidth
                className="justify-start truncate text-default-500 data-[hover=true]:text-foreground"
                startContent={
                  <Icon
                    className="flex-none text-default-500"
                    icon="solar:info-circle-line-duotone"
                    width={24}
                  />
                }
                variant="light"
              >
                Help & Information
              </Button>
              <Button
                className="justify-start text-default-500 data-[hover=true]:text-foreground"
                startContent={
                  <Icon
                    className="flex-none rotate-180 text-default-500"
                    icon="solar:minus-circle-line-duotone"
                    width={24}
                  />
                }
                variant="light"
                onPress={() => logout()}
              >
                Log Out
              </Button>
            </div>
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
} 