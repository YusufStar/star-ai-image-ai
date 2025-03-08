"use client";

import { updateUser } from "@/actions/auth-actions";
import { 
  addToast, 
  Button, 
  Card, 
  CardBody, 
  CardHeader, 
  Divider, 
  Input, 
  Spinner 
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@supabase/supabase-js";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

const formSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(1),
});

interface AccountFormProps {
  user: User;
}

const AccountForm = ({ user }: AccountFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user.email || "",
      fullName: user.user_metadata.full_name || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const { error, success, data } = await updateUser(values);

      if (!success) {
        addToast({
          title: "Error",
          description: error,
          color: "danger",
        });
      } else {
        addToast({
          title: "Success",
          description: "Your account has been updated",
          color: "success",
        });
      }
    } catch (error) {
      addToast({
        title: "Error",
        description: "There was an error updating your account",
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
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border border-default-200 shadow-lg">
        <CardHeader className="flex items-center gap-2 bg-gradient-to-r from-default-100 to-default-50 px-6 py-4">
          <Icon
            className="text-xl text-default-500"
            icon="solar:user-circle-linear"
          />
          <span className="text-lg font-semibold">
            Account Information
          </span>
        </CardHeader>

        <CardBody className="px-6 py-5">
          <div className="mb-6">
            <p className="text-sm text-default-500">
              Update your personal information and manage your account details.
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                variant="bordered"
                radius="md"
                size="md"
                startContent={
                  <Icon
                    className="text-default-400 pointer-events-none flex-shrink-0"
                    icon="solar:user-linear"
                  />
                }
                classNames={{
                  inputWrapper: "bg-default-50 border-default-200 shadow-sm hover:border-primary/70 group-data-[focus=true]:border-primary",
                  label: "text-default-700 font-medium",
                  input: "text-sm"
                }}
                isRequired
                errorMessage={form.formState.errors.fullName?.message}
                {...form.register("fullName")}
              />
              
              <Input
                label="Email Address"
                placeholder="Enter your email"
                variant="bordered"
                radius="md"
                size="md"
                startContent={
                  <Icon
                    className="text-default-400 pointer-events-none flex-shrink-0"
                    icon="solar:letter-linear"
                  />
                }
                classNames={{
                  inputWrapper: "bg-default-50 border-default-200 shadow-sm",
                  label: "text-default-700 font-medium",
                  input: "text-sm"
                }}
                isDisabled
                description="Email cannot be changed after registration"
                {...form.register("email")}
              />
            </div>
            
            <div className="flex justify-end pt-2">
              <Button 
                type="submit" 
                color="primary"
                className="font-medium shadow-sm"
                startContent={!isLoading && 
                  <Icon
                    className="text-lg"
                    icon="solar:pen-bold-duotone"
                  />
                }
                isLoading={isLoading}
                size="sm"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default AccountForm;
