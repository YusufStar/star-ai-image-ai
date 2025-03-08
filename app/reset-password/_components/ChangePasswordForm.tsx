"use client";

import { z } from "zod";
import { useState } from "react";
import { Button, Input, Form, addToast } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

import { changePassword } from "@/actions/auth-actions";

const passwordSchema = z
  .string({
    required_error: "Password is required",
  })
  .min(8, {
    message: "Password must be at least 8 characters long",
  })
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }
  );

const confirmPasswordSchema = z
  .string({
    required_error: "Confirm password is required",
  })
  .min(8, {
    message: "Password must be at least 8 characters long",
  })
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }
  );

const formSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export default function ChangePasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const togglePasswordVisibility = () =>
    setIsPasswordVisible(!isPasswordVisible);
  const toggleConfirmPasswordVisibility = () =>
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

  const getPasswordError = (password: string) => {
    try {
      passwordSchema.parse(password);
      return null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.errors[0].message;
      }
      return "Invalid password";
    }
  };

  const getConfirmPasswordError = (confirmPassword: string) => {
    try {
      confirmPasswordSchema.parse(confirmPassword);

      if (password !== confirmPassword && confirmPassword.length > 0) {
        return "Passwords do not match";
      }

      return null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.errors[0].message;
      }
      return "Invalid password";
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const validatedData = formSchema.parse({
        password,
        confirmPassword,
      });

      const response = await changePassword({
        password: validatedData.password,
      });

      addToast({
        title: "Password changed",
        description: "Your password has been changed successfully",
        color: "success",
      });

      if (response.success) {
        router.replace("/login?mode=login");
      } else {
        setError(response.error || "Failed to change password");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full text-left">
        <p className="pb-2 text-xl font-medium sm:text-2xl">Reset Password</p>
        <p className="text-small text-default-500">
          Enter your new password below
        </p>
      </div>

      {error && (
        <div className="w-full rounded-medium bg-danger-50 p-3 text-danger-foreground text-xs">
          {error}
        </div>
      )}

      <Form
        className="flex w-full flex-col gap-3"
        validationBehavior="native"
        onSubmit={handleSubmit}
      >
        <Input
          isRequired
          classNames={{
            base: "w-full",
            inputWrapper: "bg-default-100",
          }}
          label="New Password"
          placeholder="Enter your new password"
          type={isPasswordVisible ? "text" : "password"}
          value={password}
          onValueChange={setPassword}
          errorMessage={getPasswordError(password)}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={togglePasswordVisibility}
            >
              {isPasswordVisible ? (
                <Icon
                  icon="solar:eye-closed-linear"
                  className="text-2xl text-default-400"
                />
              ) : (
                <Icon
                  icon="solar:eye-bold"
                  className="text-2xl text-default-400"
                />
              )}
            </button>
          }
        />

        <Input
          isRequired
          classNames={{
            base: "w-full",
            inputWrapper: "bg-default-100",
          }}
          label="Confirm Password"
          placeholder="Confirm your new password"
          type={isConfirmPasswordVisible ? "text" : "password"}
          value={confirmPassword}
          onValueChange={setConfirmPassword}
          errorMessage={getConfirmPasswordError(confirmPassword)}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleConfirmPasswordVisibility}
            >
              {isConfirmPasswordVisible ? (
                <Icon
                  icon="solar:eye-closed-linear"
                  className="text-2xl text-default-400"
                />
              ) : (
                <Icon
                  icon="solar:eye-bold"
                  className="text-2xl text-default-400"
                />
              )}
            </button>
          }
        />

        <Button
          className="w-full"
          color="primary"
          type="submit"
          isLoading={loading}
          isDisabled={loading}
        >
          Reset Password
        </Button>

        <div className="flex justify-center pt-2">
          <Button
            as="a"
            href="/login"
            variant="light"
            color="primary"
            className="font-medium"
          >
            Back to Login
          </Button>
        </div>
      </Form>
    </>
  );
}
