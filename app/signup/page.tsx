import PulseLogo from "@/app/ui/pulse-logo";
import LoginForm from "@/app/ui/login-form";
import { Suspense } from "react";

export default function SignupPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <PulseLogo />
          </div>
        </div>
        <Suspense>
          <LoginForm mode="signup" />
        </Suspense>
        <div className="text-center mt-4">
          <span>Already have an account? </span>
          <a href="/login" className="text-blue-600 hover:underline">
            Log in
          </a>
        </div>
      </div>
    </main>
  );
}
