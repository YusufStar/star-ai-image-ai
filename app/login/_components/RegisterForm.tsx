"use client";

import React from "react";
import { Button, Input, Link, Checkbox, Form } from "@heroui/react";
import { Icon } from "@iconify/react";

interface RegisterFormProps {
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
  full_name: string;
  isVisible: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onFullNameChange: (value: string) => void;
  onTermsChange: (value: boolean) => void;
  onToggleVisibility: () => void;
  getEmailError: (email: string) => string | null;
  getPasswordError: (password: string) => string | null;
  getConfirmPasswordError: (password: string, confirmPassword: string) => string | null;
  getFullNameError: (full_name: string) => string | null;
  loading: boolean;
}

export default function RegisterForm({
  email,
  password,
  confirmPassword,
  terms,
  full_name,
  isVisible,
  onSubmit,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onFullNameChange,
  onTermsChange,
  onToggleVisibility,
  getEmailError,
  getPasswordError,
  getConfirmPasswordError,
  getFullNameError,
  loading
}: RegisterFormProps) {
  return (
    <>
      <div className="w-full text-left">
        <p className="pb-2 text-xl font-medium sm:text-2xl">Create Account</p>
        <p className="text-small text-default-500">Sign up for a new account to get started</p>
      </div>

      <Form className="flex w-full flex-col gap-3" onSubmit={onSubmit}>
        <Input
          isRequired
          classNames={{
            label: "text-sm sm:text-base",
            input: "text-sm sm:text-base"
          }}
          errorMessage={getFullNameError(full_name)}
          isInvalid={getFullNameError(full_name) !== null}
          label="Full Name"
          name="full_name"
          placeholder="Enter your full name"
          type="text"
          value={full_name}
          variant="underlined"
          onChange={(e) => onFullNameChange(e.target.value)}
        />
        <Input
          isRequired
          classNames={{
            label: "text-sm sm:text-base",
            input: "text-sm sm:text-base"
          }}
          errorMessage={getEmailError(email)}
          isInvalid={getEmailError(email) !== null}
          label="Email Address"
          name="email"
          placeholder="Enter your email"
          type="email"
          value={email}
          variant="underlined"
          onChange={(e) => onEmailChange(e.target.value)}
        />
        <Input
          isRequired
          classNames={{
            label: "text-sm sm:text-base",
            input: "text-sm sm:text-base"
          }}
          endContent={
            <button type="button" onClick={onToggleVisibility}>
              {isVisible ? (
                <Icon
                  className="pointer-events-none text-xl sm:text-2xl text-default-400"
                  icon="solar:eye-closed-linear"
                />
              ) : (
                <Icon
                  className="pointer-events-none text-xl sm:text-2xl text-default-400"
                  icon="solar:eye-bold"
                />
              )}
            </button>
          }
          errorMessage={getPasswordError(password)}
          isInvalid={getPasswordError(password) !== null}
          label="Password"
          name="password"
          placeholder="Create a password"
          type={isVisible ? "text" : "password"}
          value={password}
          variant="underlined"
          onChange={(e) => onPasswordChange(e.target.value)}
        />
        <Input
          isRequired
          classNames={{
            label: "text-sm sm:text-base",
            input: "text-sm sm:text-base"
          }}
          errorMessage={getConfirmPasswordError(password, confirmPassword)}
          isInvalid={getConfirmPasswordError(password, confirmPassword) !== null}
          label="Confirm Password"
          name="confirmPassword"
          placeholder="Confirm your password"
          type={isVisible ? "text" : "password"}
          value={confirmPassword}
          variant="underlined"
          onChange={(e) => onConfirmPasswordChange(e.target.value)}
        />
        <Checkbox
          isRequired
          className="py-4"
          classNames={{
            label: "text-xs sm:text-sm"
          }}
          isSelected={terms}
          size="sm"
          onValueChange={onTermsChange}
        >
          I agree with the&nbsp;
          <Link href="#" size="sm">
            Terms
          </Link>
          &nbsp; and&nbsp;
          <Link href="#" size="sm">
            Privacy Policy
          </Link>
        </Checkbox>
        <Button
          className="w-full h-10 sm:h-11 text-sm sm:text-base"
          color="primary"
          isLoading={loading}
          type="submit"
        >
          Sign Up
        </Button>
      </Form>

      <p className="text-center text-xs sm:text-sm">
        Already have an account?&nbsp;
        <Link href="?mode=login" size="sm">
          Log In
        </Link>
      </p>
    </>
  );
} 