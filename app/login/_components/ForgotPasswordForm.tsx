"use client";

import React from "react";
import { Button, Input, Link, Form } from "@heroui/react";

interface ForgotPasswordFormProps {
  email: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onEmailChange: (value: string) => void;
  getEmailError: (email: string) => string | null;
}

export default function ForgotPasswordForm({
  email,
  onSubmit,
  onEmailChange,
  getEmailError,
}: ForgotPasswordFormProps) {
  return (
    <>
      <div className="w-full text-left">
        <p className="pb-2 text-xl font-medium">Reset Password</p>
        <p className="text-small text-default-500">Enter your email to reset your password</p>
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
        <Button className="mt-2 w-full" color="primary" type="submit">
          Send Reset Link
        </Button>
      </Form>

      <p className="text-center text-small">
        Remember your password?&nbsp;
        <Link href="?mode=login" size="sm">
          Log In
        </Link>
      </p>
    </>
  );
} 