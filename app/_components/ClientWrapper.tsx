"use client";

import React from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";

import LandingNavbar from "./LandingNavbar";
import Hero from "./Hero";
import Features from "./Features";
import About from "./About";
import Contact from "./Contact";
import Pricing from "./Pricing";

import { Tables } from "@/database.type";

type Product = Tables<"products">;
type Price = Tables<"prices">;

interface ProductWithPrice extends Product {
  prices: Price[];
}

interface ClientWrapperProps {
  products: ProductWithPrice[];
}

export default function ClientWrapper({ products }: ClientWrapperProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingNavbar />

      <main className="flex-1 pt-16 mx-auto w-full max-w-7xl">
        {/* Hero Section */}
        <Hero />

        {/* Features Section */}
        <Features />

        {/* Pricing Section */}
        <Pricing products={products} />

        {/* About Section */}
        <About />

        {/* Contact Section */}
        <Contact />
      </main>

      {/* Footer */}
      <footer className="w-full py-6 sm:py-8 bg-background border-t border-border">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="space-y-3">
              <h3 className="text-base sm:text-lg font-semibold">Product</h3>
              <ul className="space-y-2">
                {["Features", "Pricing", "Testimonials", "FAQ"].map(
                  (item, i) => (
                    <li key={i}>
                      <Link
                        className="text-foreground-600 hover:text-primary text-xs sm:text-sm"
                        href="/"
                      >
                        {item}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-base sm:text-lg font-semibold">Company</h3>
              <ul className="space-y-2">
                {["About", "Blog", "Careers", "Press"].map((item, i) => (
                  <li key={i}>
                    <Link
                      className="text-foreground-600 hover:text-primary text-xs sm:text-sm"
                      href="/"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-base sm:text-lg font-semibold">Resources</h3>
              <ul className="space-y-2">
                {["Documentation", "Help Center", "API", "Community"].map(
                  (item, i) => (
                    <li key={i}>
                      <Link
                        className="text-foreground-600 hover:text-primary text-xs sm:text-sm"
                        href="/"
                      >
                        {item}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-base sm:text-lg font-semibold">Legal</h3>
              <ul className="space-y-2">
                {[
                  "Privacy Policy",
                  "Terms of Service",
                  "Cookie Policy",
                  "GDPR",
                ].map((item, i) => (
                  <li key={i}>
                    <Link
                      className="text-foreground-600 hover:text-primary text-xs sm:text-sm"
                      href="/"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center pt-4 sm:pt-6 border-t border-border">
            <div className="flex items-center gap-2 mb-4 sm:mb-0">
              <div className="p-1 rounded-full bg-primary text-white">
                <svg
                  fill="none"
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <p className="font-bold text-sm sm:text-base">STAR AI</p>
            </div>
            <p className="text-foreground-600 text-xs sm:text-sm">
              © 2023 STAR AI. All rights reserved.
            </p>
            <div className="flex gap-3 mt-4 sm:mt-0">
              {[
                "solar:twitter-bold",
                "solar:instagram-bold",
                "solar:facebook-bold",
                "solar:github-bold",
              ].map((icon, i) => (
                <Link
                  key={i}
                  className="text-foreground-600 hover:text-primary"
                  href="/"
                >
                  <Icon className="text-lg sm:text-xl" icon={icon} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
