"use client";

import { useSignUp } from "@/entities/user/api/hooks";
import { PublicRoutes } from "@/shared/config/routes/public.routes";
import { Button } from "@/shared/ui/button";
import Checkbox from "@/shared/ui/checkbox";
import Input from "@/shared/ui/input";
import Logo from "@/shared/ui/logo";

import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";

import Link from "next/link";
import * as yup from "yup";

const schema = yup
  .object({
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    password: yup.string().required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Please confirm your password"),
    agreeToTerms: yup
      .boolean()
      .oneOf([true], "You must agree to the terms and conditions")
      .required("You must agree to the terms and conditions"),
  })
  .required();
type FormData = yup.InferType<typeof schema>;

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { signUp, isPending } = useSignUp();

  const onSubmit = (data: FormData) => {
    const { confirmPassword, agreeToTerms, ...signUpData } = data;
    signUp(signUpData);
  };

  return (
    <div className="bg-secondary/80 backdrop-blur-sm rounded-xl px-8 py-10 shadow-xl border border-border/20 w-full max-w-md">
      <div className="flex flex-col items-center mb-8">
        <div className="mb-6">
          <Logo />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-center text-accent">
          Create an Account
        </h2>
        <p className="text-sm text-center text-primary/60">
          Join our community today
        </p>
      </div>
      <form
        className="flex flex-col gap-5 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          containerClassName="w-full"
          labelClassName="bg-secondary/80"
          label="Name"
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          containerClassName="w-full"
          labelClassName="bg-secondary/80"
          label="Email"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          containerClassName="w-full"
          labelClassName="bg-secondary/80"
          label="Password"
          error={errors.password?.message}
          type="password"
          {...register("password")}
        />

        <Input
          containerClassName="w-full"
          labelClassName="bg-secondary/80"
          label="Confirm Password"
          error={errors.confirmPassword?.message}
          type="password"
          {...register("confirmPassword")}
        />

        <div className="flex items-start w-full">
          <label className="cursor-pointer flex items-center">
            <Checkbox className="mr-2 mt-1" {...register("agreeToTerms")} />
            <span className="text-sm select-none">
              I agree to the{" "}
              <Link
                href={PublicRoutes.TERMS_OF_SERVICE}
                className="text-accent hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href={PublicRoutes.PRIVACY_POLICY}
                className="text-accent hover:underline"
              >
                Privacy Policy
              </Link>
            </span>
          </label>
        </div>
        {errors.agreeToTerms && (
          <p className="text-sm text-red-500">{errors.agreeToTerms.message}</p>
        )}

        <Button
          disabled={isPending}
          className="w-full mt-2 bg-accent hover:bg-accent/90"
          type="submit"
        >
          {isPending ? "Creating account..." : "Sign up"}
        </Button>

        <div className="mt-4 text-center text-sm text-primary/60">
          Already have an account?{" "}
          <Link
            href={PublicRoutes.SIGN_IN}
            className="text-accent hover:underline"
          >
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
