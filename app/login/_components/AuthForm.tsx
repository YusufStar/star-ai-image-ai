"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter, redirect } from "next/navigation";
import { addToast } from "@heroui/react";
import { useState } from "react";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";

import { forgotPassword, login, signup } from "@/actions/auth-actions";

interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
  full_name: string;
}

interface ForgotPasswordForm {
  email: string;
}

export default function AuthForm() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [mode, setMode] = React.useState<
    "login" | "register" | "forgot-password"
  >("login");
  const searchParams = useSearchParams();
  const router = useRouter();

  // Form states
  const [loginForm, setLoginForm] = React.useState<LoginForm>({
    email: "",
    password: "",
    remember: false,
  });
  const [registerForm, setRegisterForm] = React.useState<RegisterForm>({
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
    full_name: "",
  });
  const [forgotPasswordForm, setForgotPasswordForm] =
    React.useState<ForgotPasswordForm>({ email: "" });
  const [registerLoading, setRegisterLoading] = useState<boolean>(false);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] =
    useState<boolean>(false);

  React.useEffect(() => {
    if (!searchParams) return;

    const currentMode = searchParams.get("mode");

    if (
      currentMode === "login" ||
      currentMode === "register" ||
      currentMode === "forgot-password"
    ) {
      setMode(currentMode);
      // Reset forms when mode changes
      setLoginForm({ email: "", password: "", remember: false });
      setRegisterForm({
        email: "",
        password: "",
        confirmPassword: "",
        terms: false,
        full_name: "",
      });
      setForgotPasswordForm({ email: "" });
    } else {
      router.push("?mode=login");
    }
  }, [searchParams, router]);

  const toggleVisibility = () => setIsVisible(!isVisible);

  // Validation functions
  const getEmailError = (email: string) => {
    if (!email) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Invalid email format";

    return null;
  };

  const getPasswordError = (password: string) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";

    // Check for lowercase letters
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }

    // Check for uppercase letters
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }

    // Check for numbers
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }

    // Check for special characters
    if (!/[!@#$%^&*()_+\-=[\]{};:"|,.<>/?`~]/.test(password)) {
      return 'Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;:"<>,.?`~)';
    }

    return null;
  };

  const getConfirmPasswordError = (
    password: string,
    confirmPassword: string
  ) => {
    if (!confirmPassword) return "Please confirm your password";
    if (password !== confirmPassword) return "Passwords do not match";

    return null;
  };

  const getFullNameError = (full_name: string) => {
    if (!full_name) return "Full name is required";
    if (full_name.length < 2) return "Full name must be at least 2 characters";

    return null;
  };

  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const emailError = getEmailError(loginForm.email);
    const passwordError = getPasswordError(loginForm.password);

    if (emailError || passwordError) {
      if (emailError) {
        addToast({
          title: "Email Error!",
          description: emailError,
        });
      }

      if (passwordError) {
        addToast({
          title: "Password Error!",
          description: passwordError,
        });
      }

      return;
    }

    const formData = new FormData(event.currentTarget);

    setLoginLoading(true);
    const { success, error } = await login(formData);

    if (!success) {
      addToast({
        title: "Signed in failed!",
        description: String(error),
        color: "danger",
      });
    } else {
      addToast({
        title: "Signed in successfully!",
        description: "Welcome to the StarAI.",
        color: "success",
      });

      redirect("/dashboard");
    }

    setLoginLoading(false);
  };

  const handleRegisterSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const emailError = getEmailError(registerForm.email);
    const passwordError = getPasswordError(registerForm.password);
    const confirmPasswordError = getConfirmPasswordError(
      registerForm.password,
      registerForm.confirmPassword
    );
    const fullNameError = getFullNameError(registerForm.full_name);

    // Check for validation errors
    if (
      emailError ||
      passwordError ||
      confirmPasswordError ||
      fullNameError ||
      !registerForm.terms
    ) {
      if (emailError) {
        addToast({
          title: "Email Error!",
          description: emailError,
          color: "danger",
        });
      }

      if (passwordError) {
        addToast({
          title: "Password Error!",
          description: passwordError,
          color: "danger",
        });
      }

      if (confirmPasswordError) {
        addToast({
          title: "Confirm Password Error!",
          description: confirmPasswordError,
          color: "danger",
        });
      }

      if (fullNameError) {
        addToast({
          title: "Full Name Error!",
          description: fullNameError,
          color: "danger",
        });
      }

      if (!registerForm.terms) {
        addToast({
          title: "Terms Error!",
          description: "You must accept the terms and conditions",
          color: "danger",
        });
      }

      return;
    }

    // If no errors, proceed with signup
    const formData = new FormData(event.currentTarget);

    setRegisterLoading(true);
    const { success, error } = await signup(formData);

    if (!success) {
      addToast({
        title: "Signed up failed!",
        description: String(error),
        color: "danger",
      });
    } else {
      addToast({
        title: "Signed up successfully!",
        description: "Please confirm your email address.",
        color: "success",
      });

      redirect("?mode=login");
    }

    setRegisterLoading(false);
  };

  const handleForgotPasswordSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const emailError = getEmailError(forgotPasswordForm.email);

    setForgotPasswordLoading(true);

    if (emailError) {
      addToast({
        title: "Email Error!",
        description: emailError,
        color: "danger",
      });
      setForgotPasswordLoading(false);

      return;
    }

    try {
      const { error, success } = await forgotPassword(forgotPasswordForm.email);

      if (!success) {
        addToast({
          title: "Error",
          description: error,
          color: "danger",
        });
      } else {
        addToast({
          title: "Success",
          description:
            "Password reset email has been sent to your email address",
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
      setForgotPasswordLoading(false);
    }
  };

  const formVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  return (
    <div className="flex w-full items-center justify-center h-full">
      <AnimatePresence mode="wait">
        {mode === "login" ? (
          <motion.div
            key="login"
            animate="animate"
            className="w-full sm:w-[90%] md:w-[80%] lg:w-full"
            exit="exit"
            initial="initial"
            style={{
              display: "flex",
              width: "100%",
              maxWidth: "24rem",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
              padding: "1rem",
            }}
            transition={{ duration: 0.3 }}
            variants={formVariants}
          >
            <LoginForm
              email={loginForm.email}
              getEmailError={getEmailError}
              getPasswordError={getPasswordError}
              isVisible={isVisible}
              loading={loginLoading}
              password={loginForm.password}
              remember={loginForm.remember}
              onEmailChange={(value) =>
                setLoginForm({ ...loginForm, email: value })
              }
              onPasswordChange={(value) =>
                setLoginForm({ ...loginForm, password: value })
              }
              onRememberChange={(value) =>
                setLoginForm({ ...loginForm, remember: value })
              }
              onSubmit={handleLoginSubmit}
              onToggleVisibility={toggleVisibility}
            />
          </motion.div>
        ) : mode === "register" ? (
          <motion.div
            key="register"
            animate="animate"
            className="w-full sm:w-[90%] md:w-[80%] lg:w-full"
            exit="exit"
            initial="initial"
            style={{
              display: "flex",
              width: "100%",
              maxWidth: "24rem",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
              padding: "1rem",
            }}
            transition={{ duration: 0.3 }}
            variants={formVariants}
          >
            <RegisterForm
              confirmPassword={registerForm.confirmPassword}
              email={registerForm.email}
              full_name={registerForm.full_name}
              getConfirmPasswordError={getConfirmPasswordError}
              getEmailError={getEmailError}
              getFullNameError={getFullNameError}
              getPasswordError={getPasswordError}
              isVisible={isVisible}
              loading={registerLoading}
              password={registerForm.password}
              terms={registerForm.terms}
              onConfirmPasswordChange={(value) =>
                setRegisterForm({ ...registerForm, confirmPassword: value })
              }
              onEmailChange={(value) =>
                setRegisterForm({ ...registerForm, email: value })
              }
              onFullNameChange={(value) =>
                setRegisterForm({ ...registerForm, full_name: value })
              }
              onPasswordChange={(value) =>
                setRegisterForm({ ...registerForm, password: value })
              }
              onSubmit={handleRegisterSubmit}
              onTermsChange={(value) =>
                setRegisterForm({ ...registerForm, terms: value })
              }
              onToggleVisibility={toggleVisibility}
            />
          </motion.div>
        ) : (
          <motion.div
            key="forgot-password"
            animate="animate"
            className="w-full sm:w-[90%] md:w-[80%] lg:w-full"
            exit="exit"
            initial="initial"
            style={{
              display: "flex",
              width: "100%",
              maxWidth: "24rem",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
              padding: "1rem",
            }}
            transition={{ duration: 0.3 }}
            variants={formVariants}
          >
            <ForgotPasswordForm
              email={forgotPasswordForm.email}
              getEmailError={getEmailError}
              loading={forgotPasswordLoading}
              onEmailChange={(value) =>
                setForgotPasswordForm({ ...forgotPasswordForm, email: value })
              }
              onSubmit={handleForgotPasswordSubmit}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
