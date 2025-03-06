"use client";

import React, { useRef, useEffect } from "react";
import { Button, Avatar, Divider, Chip, Card, CardBody, CardFooter } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion, useAnimation, useInView } from "framer-motion";

// Expanded team members array for infinite scrolling effect
const teamMembers = [
  {
    name: "Alex Johnson",
    role: "Founder & CEO",
    image: "https://i.pravatar.cc/150?img=1",
    bio: "10+ years experience in AI and machine learning",
    delay: 0.1
  },
  {
    name: "Sarah Chen",
    role: "CTO",
    image: "https://i.pravatar.cc/150?img=5",
    bio: "Former lead engineer at Google AI",
    delay: 0.2
  },
  {
    name: "Michael Rodriguez",
    role: "Lead AI Engineer",
    image: "https://i.pravatar.cc/150?img=3",
    bio: "PhD in Computer Vision from MIT",
    delay: 0.3
  },
  {
    name: "Emma Wilson",
    role: "UX Designer",
    image: "https://i.pravatar.cc/150?img=4",
    bio: "Award-winning designer with focus on user experience",
    delay: 0.4
  },
  {
    name: "David Kim",
    role: "ML Engineer",
    image: "https://i.pravatar.cc/150?img=7",
    bio: "Specialized in natural language processing",
    delay: 0.5
  },
  {
    name: "Olivia Martinez",
    role: "Product Manager",
    image: "https://i.pravatar.cc/150?img=9",
    bio: "Expert in AI product development and strategy",
    delay: 0.6
  },
  {
    name: "James Taylor",
    role: "Backend Developer",
    image: "https://i.pravatar.cc/150?img=12",
    bio: "Cloud infrastructure and scalability specialist",
    delay: 0.7
  },
  {
    name: "Sophia Wang",
    role: "Data Scientist",
    image: "https://i.pravatar.cc/150?img=10",
    bio: "Expert in data analysis and model training",
    delay: 0.8
  }
];

// Duplicate the array for seamless infinite scrolling
const extendedTeamMembers = [...teamMembers, ...teamMembers];

const stats = [
  { value: "2M+", label: "Images Generated", icon: "solar:gallery-bold-duotone", delay: 0.1 },
  { value: "50K+", label: "Active Users", icon: "solar:users-group-rounded-bold-duotone", delay: 0.2 },
  { value: "99.9%", label: "Uptime", icon: "solar:server-bold-duotone", delay: 0.3 },
  { value: "24/7", label: "Support", icon: "solar:headphones-round-bold-duotone", delay: 0.4 }
];

export default function About() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const inView = useInView(sliderRef as React.RefObject<Element>, { once: false, amount: 0.2 });

  useEffect(() => {
    if (inView) {
      controls.start({
        x: [0, -1920], // Move by the width of the slider
        transition: {
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 40,
            ease: "linear"
          }
        }
      });
    }
  }, [controls, inView]);

  return (
    <section className="w-full py-12 sm:py-16 md:py-20" id="about">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left side - About content */}
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <Chip 
              className="mb-3" 
              color="secondary" 
              size="sm"
              startContent={<Icon className="text-secondary text-sm" icon="solar:info-circle-bold-duotone" />}
              variant="flat"
            >
              About Us
            </Chip>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Revolutionizing Image Creation with AI
            </h2>
            <p className="text-foreground-600 mb-4 sm:mb-6 text-sm sm:text-base">
              At STAR AI, we&apos;re passionate about making advanced AI image generation accessible to everyone. 
              Our team of experts has developed a platform that combines cutting-edge technology with an 
              intuitive user experience, allowing you to bring your creative visions to life effortlessly.
            </p>
            
            <div className="space-y-2 sm:space-y-4 mb-6 sm:mb-8">
              {["Founded in 2022", "Based in San Francisco", "Backed by top investors"].map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Icon className="text-success text-base sm:text-lg" icon="solar:check-circle-bold" />
                  <span className="text-sm sm:text-base">{item}</span>
                </div>
              ))}
            </div>
            
            <Button 
              className="font-medium text-sm sm:text-base" 
              color="secondary" 
              endContent={<Icon icon="solar:arrow-right-bold" />}
              radius="full"
              size="md"
              variant="shadow"
            >
              Learn Our Story
            </Button>
          </motion.div>
          
          {/* Right side - Stats */}
          <motion.div 
            className="flex-1 w-full"
            initial={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <Card className="border border-border bg-content1/5 backdrop-blur-sm">
              <CardBody className="p-4 sm:p-6">
                <div className="grid grid-cols-2 gap-3 sm:gap-6">
                  {stats.map((stat, index) => (
                    <motion.div 
                      key={index}
                      className="flex flex-col items-center text-center p-3 sm:p-4 bg-background rounded-xl border border-border"
                      initial={{ opacity: 0, y: 10 }}
                      transition={{ delay: stat.delay, duration: 0.4 }}
                      viewport={{ once: true }}
                      whileInView={{ opacity: 1, y: 0 }}
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2 sm:mb-3">
                        <Icon className="text-primary text-lg sm:text-xl" icon={stat.icon} />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold">{stat.value}</h3>
                      <p className="text-foreground-600 text-xs sm:text-sm">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>
        
        <Divider className="my-8 sm:my-12" />
        
        {/* Team section - Revised with auto-scrolling slider */}
        <div className="text-center mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">Meet Our Team</h2>
            <p className="text-foreground-600 max-w-2xl mx-auto mb-4 sm:mb-6 text-sm sm:text-base">
              Our talented team of experts is dedicated to pushing the boundaries of AI image generation
              with years of experience in machine learning, computer vision, and design.
            </p>
          </motion.div>
        </div>
        
        {/* Auto-scrolling infinite slider */}
        <div className="relative w-full overflow-hidden py-4">
          {/* Gradient overlays for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 z-10 bg-gradient-to-r from-background to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 z-10 bg-gradient-to-l from-background to-transparent" />
          
          <div ref={sliderRef} className="w-full overflow-hidden">
            <motion.div 
              animate={controls}
              className="flex gap-3 sm:gap-4 w-max"
            >
              {extendedTeamMembers.map((member, index) => (
                <div key={index} className="w-48 sm:w-64 flex-shrink-0">
                  <Card className="border border-border h-full">
                    <CardBody className="p-3 sm:p-4 flex flex-col items-center text-center">
                      <Avatar
                        isBordered
                        className="w-16 h-16 sm:w-20 sm:h-20 mb-2 sm:mb-3 ring-2 ring-primary/20"
                        color="primary"
                        size="lg"
                        src={member.image}
                      />
                      <h3 className="text-base sm:text-lg font-semibold mb-0.5 sm:mb-1">{member.name}</h3>
                      <p className="text-foreground-600 text-xs sm:text-sm mb-1 sm:mb-2">{member.role}</p>
                      <p className="text-foreground-500 text-xs">{member.bio}</p>
                    </CardBody>
                    <CardFooter className="pt-0 pb-2 sm:pb-3 px-3 sm:px-4 flex justify-center gap-2">
                      <Button isIconOnly radius="full" size="sm" variant="light">
                        <Icon className="text-base sm:text-lg" icon="solar:twitter-bold" />
                      </Button>
                      <Button isIconOnly radius="full" size="sm" variant="light">
                        <Icon className="text-base sm:text-lg" icon="solar:linkedin-bold" />
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
        
        {/* Join our team button */}
        <motion.div
          className="mt-6 sm:mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <Button 
            className="font-medium text-sm sm:text-base" 
            color="secondary"
            endContent={<Icon icon="solar:users-group-rounded-bold-duotone" />}
            radius="full"
            size="md"
            variant="bordered"
          >
            Join Our Team
          </Button>
        </motion.div>
      </div>
    </section>
  );
} 