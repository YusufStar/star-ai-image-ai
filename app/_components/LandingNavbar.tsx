"use client";

import React, { useState, useEffect } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Link,
  Button,
  Tooltip,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

import { AcmeIcon } from "./acme";

const menuItems = [
  { name: "Home", href: "#home", icon: "solar:home-bold-duotone" },
  { name: "Features", href: "#features", icon: "solar:widget-bold-duotone" },
  { name: "Pricing", href: "#pricing", icon: "solar:tag-price-bold-duotone" },
  { name: "About", href: "#about", icon: "solar:info-circle-bold-duotone" },
  {
    name: "Contact",
    href: "#contact",
    icon: "solar:chat-round-dots-bold-duotone",
  },
];

export default function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Update active section based on scroll position
      const sections = menuItems.map((item) => item.href.substring(1));
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);

        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);

    if (section) {
      // Adjust scroll position based on screen size
      const offset = window.innerWidth < 640 ? 60 : 80;

      window.scrollTo({
        top: section.offsetTop - offset,
        behavior: "smooth",
      });
    }
    setIsMenuOpen(false);
  };

  return (
    <Navbar
      className={`py-1 sm:py-2 transition-all duration-300 fixed top-0 z-50 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md shadow-sm"
          : "bg-transparent !border-transparent"
      }`}
      isBordered={true}
      isMenuOpen={isMenuOpen}
      maxWidth="xl"
      shouldHideOnScroll={false}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="gap-2 sm:gap-4" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden text-foreground"
        />
        <NavbarBrand className="flex items-center gap-1 sm:gap-2">
          <div
            className={`p-1 rounded-full ${isScrolled ? "bg-primary" : "bg-primary/90"} text-white transition-all duration-300`}
          >
            <AcmeIcon className="sm:w-8 sm:h-8" size={28} />
          </div>
          <motion.p
            animate={{ opacity: 1, x: 0 }}
            className="font-bold text-inherit hidden sm:block"
            initial={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.5 }}
          >
            STAR AI
          </motion.p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-1 md:gap-4" justify="center">
        {menuItems.map((item, index) => (
          <NavbarItem
            key={`${item.name}-${index}`}
            isActive={activeSection === item.href.substring(1)}
          >
            <Tooltip closeDelay={0} content={item.name} delay={500}>
              <Link
                className="relative px-1 md:px-2 py-1 group text-xs md:text-sm"
                color={
                  activeSection === item.href.substring(1)
                    ? "primary"
                    : "foreground"
                }
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.href.substring(1));
                }}
              >
                <Icon className="text-sm mr-1 md:mr-2" icon={item.icon} />
                <span className="relative z-10">{item.name}</span>
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${
                    activeSection === item.href.substring(1)
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                 />
              </Link>
            </Tooltip>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="hidden sm:flex">
          <Button
            as={Link}
            className="font-medium text-xs md:text-sm"
            color="default"
            href="/login?mode=login"
            radius="full"
            size="sm"
            startContent={
              <Icon className="text-lg" icon="solar:user-outline" />
            }
            variant="flat"
          >
            Login
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button
            as={Link}
            className="font-medium text-xs md:text-sm"
            color="primary"
            href="/login?mode=register"
            radius="full"
            size="sm"
            variant="shadow"
          >
            Get Started
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="pt-6 bg-background/80 backdrop-blur-md">
        <div className="flex flex-col gap-2 mt-2">
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item.name}-mobile-${index}`}>
              <Link
                className="w-full text-base md:text-lg font-medium flex items-center gap-2"
                color={
                  activeSection === item.href.substring(1)
                    ? "primary"
                    : "foreground"
                }
                href={item.href}
                size="lg"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.href.substring(1));
                }}
              >
                <Icon className="text-lg" icon={item.icon} />
                {item.name}
              </Link>
            </NavbarMenuItem>
          ))}
          <NavbarMenuItem className="mt-5">
            <Button
              as={Link}
              className="w-full font-medium"
              color="default"
              href="/login?mode=login"
              radius="full"
              startContent={
                <Icon className="text-lg" icon="solar:user-outline" />
              }
              variant="flat"
            >
              Login
            </Button>
          </NavbarMenuItem>
        </div>
      </NavbarMenu>
    </Navbar>
  );
}
