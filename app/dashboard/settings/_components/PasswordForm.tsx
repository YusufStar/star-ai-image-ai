"use client";

import {
  addToast,
  Button,
  Card,
  CardBody,
  CardHeader,
  Spinner,
} from "@heroui/react";
import { useState } from "react";
import { updatePassword } from "@/actions/auth-actions";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

const PasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  async function handleResetPassword() {
    try {
      setIsLoading(true);
      const { error, success } = await updatePassword();

      if (!success) {
        addToast({
          title: "Error",
          description: error,
          color: "danger",
        });
      } else {
        addToast({
          title: "Success",
          description: "Password reset email has been sent to your email address",
          color: "success",
        });
      }
    } catch (error) {
      addToast({
        title: "Error",
        description: "There was an error sending the password reset email",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="overflow-hidden border border-default-200 shadow-lg">
        <CardHeader className="flex items-center gap-2 bg-gradient-to-r from-default-100 to-default-50 px-6 py-4">
          <Icon
            className="text-xl text-default-500"
            icon="solar:shield-keyhole-linear"
          />
          <span className="text-lg font-semibold">
            Security Settings
          </span>
        </CardHeader>

        <CardBody className="px-6 py-5">
          <div className="mb-6">
            <p className="text-sm text-default-500">
              To change your password, click the button below. We'll send a password reset link to your email address.
            </p>
          </div>

          <div className="flex justify-start pt-2">
            <Button 
              color="primary" 
              className="font-medium shadow-sm"
              startContent={!isLoading && 
                <Icon
                  className="text-lg"
                  icon="solar:mail-linear"
                />
              }
              isLoading={isLoading}
              size="sm"
              onClick={handleResetPassword}
            >
              Send Reset Password Email
            </Button>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default PasswordForm;
