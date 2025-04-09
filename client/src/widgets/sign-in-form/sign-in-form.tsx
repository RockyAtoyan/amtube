"use client";

import { useSignIn } from "@/entities/user/api/hooks";
import { PublicRoutes } from "@/shared/config/routes/public.routes";
import { Button } from "@/shared/ui/button";
import Checkbox from "@/shared/ui/checkbox";
import Input from "@/shared/ui/input";
import Logo from "@/shared/ui/logo";

import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import * as yup from "yup";

const schema = yup
  .object({
    email: yup.string().required(),
    password: yup.string().required(),
  })
  .required();
type FormData = yup.InferType<typeof schema>;

const SignInForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || undefined;

  const { signIn, isPending } = useSignIn(from);

  const onSubmit = (data: FormData) => {
    signIn(data);
  };

  return (
    <div className="bg-secondary/80 backdrop-blur-sm rounded-xl px-8 py-10 shadow-xl border border-border/20 w-full max-w-md">
      <div className="flex flex-col items-center mb-8">
        <div className="mb-6">
          <Logo />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-center text-accent">
          Welcome Back!
        </h2>
        <p className="text-sm text-center text-primary/60">
          Please sign in to your account
        </p>
      </div>
      <form
        className="flex flex-col gap-5 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
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

        <div className="flex items-center justify-between w-full">
          <label className="cursor-pointer flex items-center">
            <Checkbox className="mr-2" />
            <span className="text-sm select-none">Remember me</span>
          </label>
          <Link
            href={PublicRoutes.FORGOT_PASSWORD}
            className="text-sm text-accent hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          disabled={isPending}
          className="w-full mt-2 bg-accent hover:bg-accent/90"
          type="submit"
        >
          {isPending ? "Signing in..." : "Sign in"}
        </Button>

        <div className="mt-4 text-center text-sm text-primary/60">
          Don't have an account?{" "}
          <Link
            href={PublicRoutes.SIGN_UP}
            className="text-accent hover:underline"
          >
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
