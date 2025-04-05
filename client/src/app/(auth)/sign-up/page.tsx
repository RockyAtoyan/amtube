import SignUpForm from "@/features/sign-up-form/sign-up-form";

const SignUpPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-background to-secondary/30">
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
