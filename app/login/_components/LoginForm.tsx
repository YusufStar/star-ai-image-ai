"use client";

import React from "react";
import { Button, Input, Link, Checkbox, Form } from "@heroui/react";
import { Icon } from "@iconify/react";

interface LoginFormProps {
  email: string;
  password: string;
  remember: boolean;
  isVisible: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onRememberChange: (value: boolean) => void;
  onToggleVisibility: () => void;
  getEmailError: (email: string) => string | null;
  getPasswordError: (password: string) => string | null;
  loading: boolean;
}

export default function LoginForm({
  email,
  password,
  remember,
  isVisible,
  onSubmit,
  onEmailChange,
  onPasswordChange,
  onRememberChange,
  onToggleVisibility,
  getEmailError,
  getPasswordError,
  loading
}: LoginFormProps) {
  return (
    <>
      <div className="w-full text-left">
        <p className="pb-2 text-xl font-medium sm:text-2xl">Welcome Back</p>
        <p className="text-small text-default-500">Log in to your account to continue</p>
      </div>

      <Form
        className="flex w-full flex-col gap-3"
        validationBehavior="native"
        onSubmit={onSubmit}
      >
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
          placeholder="Enter your password"
          type={isVisible ? "text" : "password"}
          value={password}
          variant="underlined"
          onChange={(e) => onPasswordChange(e.target.value)}
        />
        <div className="flex w-full items-center justify-between px-1 py-2">
          <Checkbox
            classNames={{
              label: "text-xs sm:text-sm"
            }}
            isSelected={remember}
            size="sm"
            onValueChange={onRememberChange}
          >
            Remember for 15 days
          </Checkbox>
          <Link className="text-default-500 text-xs sm:text-sm" href="?mode=forgot-password" size="sm">
            Forgot password?
          </Link>
        </div>
        <Button 
          className="w-full h-10 sm:h-11 text-sm sm:text-base" 
          color="primary" 
          isLoading={loading} 
          type="submit"
        >
          Log In
        </Button>
      </Form>

      <p className="text-center text-xs sm:text-sm">
        Need to create an account?&nbsp;
        <Link href="?mode=register" size="sm">
          Sign Up
        </Link>
      </p>
    </>
  );
} 