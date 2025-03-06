import { Suspense } from "react";

import Logo from "./_components/Logo";
import AuthForm from "./_components/AuthForm";
import AuthenticationSidebar from "./_components/RightSide";

export default function LoginPage() {
  return (
    <div className="relative flex flex-col lg:flex-row h-screen w-full">
      {/* Auth Form */}
      <div className="flex flex-col w-full bg-background lg:w-1/2 px-4 sm:px-6 md:px-8 pt-4 pb-8 lg:pb-0 overflow-y-auto">
        <Logo />

        <div className="flex-1 flex items-center justify-center py-4">
          <Suspense fallback={<div className="w-full text-center">Loading...</div>}>
            <AuthForm />
          </Suspense>
        </div>
      </div>

      {/* Right side */}
      <AuthenticationSidebar />
    </div>
  );
}
