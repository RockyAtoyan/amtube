import SignInForm from "@/widgets/sign-in-form/sign-in-form";

const SignInPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-background to-secondary/30">
      <SignInForm />
    </div>
  );
};

export default SignInPage;
