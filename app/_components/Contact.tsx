"use client";

import React from "react";
import { 
  Card, 
  CardBody, 
  CardHeader,
  Input, 
  Textarea, 
  Button, 
  Chip,
  Select,
  SelectItem
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

const contactMethods = [
  {
    icon: "solar:map-point-bold-duotone",
    title: "Visit Us",
    details: "123 AI Avenue, San Francisco, CA 94107",
    color: "primary"
  },
  {
    icon: "solar:letter-bold-duotone",
    title: "Email Us",
    details: "contact@starai.com",
    color: "secondary"
  },
  {
    icon: "solar:phone-bold-duotone",
    title: "Call Us",
    details: "+1 (555) 123-4567",
    color: "success"
  }
];

export default function Contact() {
  return (
    <section className="w-full py-12 sm:py-16 md:py-20 bg-gradient-to-b from-content1/5 to-background" id="contact">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-6 sm:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Chip 
              className="mb-3" 
              color="warning" 
              size="sm"
              startContent={<Icon className="text-warning text-sm" icon="solar:chat-round-dots-bold-duotone" />}
              variant="flat"
            >
              Contact Us
            </Chip>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">Get in Touch</h2>
            <p className="text-foreground-600 max-w-2xl mx-auto text-sm sm:text-base">
              Have questions or need assistance? We&apos;re here to help. Reach out to our team and we&apos;ll get back to you as soon as possible.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {contactMethods.map((method, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <Card className="border border-border h-full">
                <CardBody className="p-4 sm:p-5 flex flex-col items-center text-center">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-${method.color}/10 flex items-center justify-center mb-2 sm:mb-3`}>
                    <Icon 
                      className={`text-${method.color} text-xl sm:text-2xl`} 
                      icon={method.icon} 
                    />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">{method.title}</h3>
                  <p className="text-foreground-600 text-xs sm:text-sm">{method.details}</p>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Map */}
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <Card className="border border-border h-full">
              <CardHeader className="pb-0 px-4 sm:px-5 pt-4 sm:pt-5">
                <h3 className="text-lg sm:text-xl font-semibold">Our Location</h3>
              </CardHeader>
              <CardBody className="p-3 sm:p-4 overflow-hidden">
                <div className="relative w-full h-full min-h-[250px] sm:min-h-[350px] bg-content2/30 rounded-lg">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-4 sm:p-6">
                      <Icon className="text-4xl sm:text-5xl text-primary mb-2 sm:mb-4" icon="solar:map-bold-duotone" />
                      <p className="text-foreground-600 mb-2 text-xs sm:text-sm">Interactive map will be displayed here</p>
                      <Chip color="primary" size="sm" variant="flat">
                        San Francisco, CA
                      </Chip>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <Card className="border border-border">
              <CardHeader className="pb-0 px-4 sm:px-5 pt-4 sm:pt-5">
                <h3 className="text-lg sm:text-xl font-semibold">Send Us a Message</h3>
              </CardHeader>
              <CardBody className="p-3 sm:p-4">
                <form className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <Input
                      label="First Name"
                      placeholder="Enter your first name"
                      radius="sm"
                      size="sm"
                      startContent={<Icon className="text-default-400" icon="solar:user-outline" />}
                      variant="bordered"
                    />
                    <Input
                      label="Last Name"
                      placeholder="Enter your last name"
                      radius="sm"
                      size="sm"
                      startContent={<Icon className="text-default-400" icon="solar:user-outline" />}
                      variant="bordered"
                    />
                  </div>
                  <Input
                    label="Email"
                    placeholder="Enter your email"
                    radius="sm"
                    size="sm"
                    startContent={<Icon className="text-default-400" icon="solar:letter-outline" />}
                    type="email"
                    variant="bordered"
                  />
                  <Select
                    label="Subject"
                    placeholder="Select a subject"
                    radius="sm"
                    size="sm"
                    startContent={<Icon className="text-default-400" icon="solar:chat-dots-outline" />}
                    variant="bordered"
                  >
                    <SelectItem key="general">General Inquiry</SelectItem>
                    <SelectItem key="support">Technical Support</SelectItem>
                    <SelectItem key="billing">Billing Question</SelectItem>
                    <SelectItem key="feedback">Feedback</SelectItem>
                  </Select>
                  <Textarea
                    label="Message"
                    minRows={3}
                    placeholder="Enter your message"
                    radius="sm"
                    size="sm"
                    variant="bordered"
                  />
                  <Button 
                    className="w-full" 
                    color="warning"
                    endContent={<Icon icon="solar:paper-plane-bold" />}
                    radius="full"
                    size="md"
                    variant="shadow"
                  >
                    Send Message
                  </Button>
                </form>
              </CardBody>
            </Card>
          </motion.div>
        </div>
        
        {/* FAQ or Additional Info */}
        <motion.div
          className="mt-6 sm:mt-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <p className="text-foreground-600 text-xs sm:text-sm mb-3 sm:mb-4">
            Need immediate assistance? Our support team is available 24/7
          </p>
          <Button 
            className="font-medium text-sm sm:text-base" 
            color="warning"
            radius="full"
            size="md"
            startContent={<Icon icon="solar:chat-round-line-bold" />}
            variant="light"
          >
            Start Live Chat
          </Button>
        </motion.div>
      </div>
    </section>
  );
} 