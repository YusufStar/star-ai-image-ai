import AuthForm from "./_components/AuthForm";
import AuthenticationSidebar from "./_components/RightSide";

import { Logo } from "@/components/icons";

export default function LoginPage() {
  return (
    <div className="relative flex h-screen w-full">
      {/* Brand Logo */}
      <div className="absolute left-2 top-5 lg:left-5">
        <div className="flex items-center">
          <Logo size={40} />
          <p className="font-medium">ACME</p>
        </div>
      </div>

      {/* Auth Form */}
      <AuthForm />

      {/* Right side */}
      <AuthenticationSidebar />
    </div>
  );
}
