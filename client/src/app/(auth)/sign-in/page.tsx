import SignInForm from "@/widgets/sign-in-form/sign-in-form";

import { Suspense } from "react";

const SignInPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-background to-secondary/30">
      <Suspense>
        <SignInForm />
      </Suspense>
    </div>
  );
};

export default SignInPage;
