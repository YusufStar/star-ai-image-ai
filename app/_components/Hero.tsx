"use client";

import React from "react";
import { Button, Chip, Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

const highlights = [
  { icon: "solar:shield-check-bold-duotone", text: "Secure & Private", color: "success" },
  { icon: "solar:flash-bold-duotone", text: "Lightning Fast", color: "warning" },
  { icon: "solar:stars-bold-duotone", text: "High Quality", color: "primary" },
  { icon: "solar:magic-stick-bold-duotone", text: "Easy to Use", color: "secondary" }
];

export default function Hero() {
  return (
    <section className="w-full py-8 sm:py-12 md:py-24 lg:py-32 xl:py-40 overflow-hidden" id="home">
      <div className="container px-4 md:px-6 mx-auto relative">
        <div className="flex flex-col items-center space-y-6 sm:space-y-8 text-center relative z-10">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 sm:space-y-4"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <Chip 
              className="mb-2" 
              color="primary" 
              size="sm"
              startContent={<Icon className="text-primary text-sm" icon="solar:star-bold-duotone" />}
              variant="flat"
            >
              AI-Powered Image Generation
            </Chip>
            
            <motion.h1 
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl/none font-bold tracking-tighter max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Transform Your Ideas into 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"> Stunning Visuals</span>
            </motion.h1>
            
            <motion.p 
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-[700px] text-foreground-600 text-sm sm:text-base md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Create beautiful, unique AI-generated images in seconds with our powerful platform. 
              No design skills required.
            </motion.p>
          </motion.div>
          
          <motion.div 
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full sm:w-auto"
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Button 
              className="font-medium px-6 sm:px-8 w-full sm:w-auto" 
              color="primary" 
              radius="full"
              size="md"
              startContent={<Icon className="text-lg" icon="solar:magic-stick-bold-duotone" />}
              variant="shadow"
            >
              Start Creating
            </Button>
            <Button 
              className="font-medium px-6 sm:px-8 w-full sm:w-auto" 
              radius="full" 
              size="md"
              startContent={<Icon className="text-lg" icon="solar:play-circle-bold-duotone" />}
              variant="bordered"
            >
              Watch Demo
            </Button>
          </motion.div>
          
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-3 sm:gap-6 pt-2 sm:pt-4"
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            {highlights.map((item, index) => (
              <div key={index} className="flex items-center gap-1 sm:gap-2">
                <Icon className={`text-${item.color} text-lg sm:text-xl`} icon={item.icon} />
                <span className="text-xs sm:text-sm text-foreground-600">{item.text}</span>
              </div>
            ))}
          </motion.div>
          
          {/* Preview Image */}
          <motion.div 
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full max-w-4xl mx-auto mt-4 sm:mt-8"
            initial={{ opacity: 0, y: 40 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <Card className="border border-border shadow-xl overflow-hidden">
              <CardBody className="p-0">
                <div className="aspect-video bg-gradient-to-br from-background to-content2 flex items-center justify-center">
                  <div className="text-center p-4 sm:p-6">
                    <Icon className="text-4xl sm:text-6xl text-primary mb-2 sm:mb-4" icon="solar:gallery-wide-bold-duotone" />
                    <p className="text-foreground-600 text-xs sm:text-base">AI-generated image preview will be displayed here</p>
                    <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mt-2 sm:mt-4">
                      {["Portrait", "Landscape", "Abstract", "Realistic"].map((tag, i) => (
                        <Chip key={i} className="bg-background/60 text-xs" size="sm" variant="flat">
                          {tag}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
            
            {/* Floating elements - hide on very small screens */}
            <motion.div 
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              className="absolute -top-6 -right-6 bg-content1 p-2 sm:p-3 rounded-lg border border-border shadow-lg hidden sm:block"
              transition={{ 
                repeat: Infinity,
                duration: 5,
                ease: "easeInOut"
              }}
            >
              <Icon className="text-primary text-xl sm:text-2xl" icon="solar:magic-stick-bold-duotone" />
            </motion.div>
            
            <motion.div 
              animate={{ 
                y: [0, 10, 0],
                rotate: [0, -5, 0]
              }}
              className="absolute -bottom-6 -left-6 bg-content1 p-2 sm:p-3 rounded-lg border border-border shadow-lg hidden sm:block"
              transition={{ 
                repeat: Infinity,
                duration: 5,
                ease: "easeInOut",
                delay: 1
              }}
            >
              <Icon className="text-warning text-xl sm:text-2xl" icon="solar:star-bold-duotone" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 