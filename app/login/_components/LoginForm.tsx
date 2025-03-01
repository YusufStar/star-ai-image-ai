"use client";

import React from "react";
import { Button, Input, Link, Divider, Checkbox, Form } from "@heroui/react";
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
        <p className="pb-2 text-xl font-medium">Welcome Back</p>
        <p className="text-small text-default-500">Log in to your account to continue</p>
      </div>

      <div className="flex w-full flex-col gap-2">
        <Button
          startContent={<Icon icon="flat-color-icons:google" width={24} />}
          variant="bordered"
        >
          Continue with Google
        </Button>
        <Button
          startContent={<Icon className="text-default-500" icon="fe:github" width={24} />}
          variant="bordered"
        >
          Continue with Github
        </Button>
      </div>

      <div className="flex w-full items-center gap-4 py-2">
        <Divider className="flex-1" />
        <p className="shrink-0 text-tiny text-default-500">OR</p>
        <Divider className="flex-1" />
      </div>

      <Form
        className="flex w-full flex-col gap-3"
        validationBehavior="native"
        onSubmit={onSubmit}
      >
        <Input
          isRequired
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
          endContent={
            <button type="button" onClick={onToggleVisibility}>
              {isVisible ? (
                <Icon
                  className="pointer-events-none text-2xl text-default-400"
                  icon="solar:eye-closed-linear"
                />
              ) : (
                <Icon
                  className="pointer-events-none text-2xl text-default-400"
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
            isSelected={remember}
            size="sm"
            onValueChange={onRememberChange}
          >
            Remember for 15 days
          </Checkbox>
          <Link className="text-default-500" href="?mode=forgot-password" size="sm">
            Forgot password?
          </Link>
        </div>
        <Button isLoading={loading} className="w-full" color="primary" type="submit">
          Log In
        </Button>
      </Form>

      <p className="text-center text-small">
        Need to create an account?&nbsp;
        <Link href="?mode=register" size="sm">
          Sign Up
        </Link>
      </p>
    </>
  );
} 