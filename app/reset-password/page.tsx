import { Suspense } from "react";
import { redirect } from "next/navigation";

import ChangePasswordForm from "./_components/ChangePasswordForm";
import AuthenticationSidebar from "../login/_components/RightSide";
import Logo from "../login/_components/Logo";

import { getUser } from "@/actions/auth-actions";

export default async function ResetPasswordPage() {
  const { data: user } = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="relative flex flex-col lg:flex-row h-screen w-full">
      {/* Reset Password Form */}
      <div className="flex flex-col w-full bg-background lg:w-1/2 px-4 sm:px-6 md:px-8 pt-4 pb-8 lg:pb-0 overflow-y-auto">
        <Logo />

        <div className="flex-1 gap-4 max-w-md w-full mx-auto flex-col flex items-center justify-center py-4">
          <Suspense
            fallback={<div className="w-full text-center">Loading...</div>}
          >
            <ChangePasswordForm />
          </Suspense>
        </div>
      </div>

      {/* Right side */}
      <AuthenticationSidebar />
    </div>
  );
}
