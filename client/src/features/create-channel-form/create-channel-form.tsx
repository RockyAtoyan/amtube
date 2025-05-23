"use client";

import { useCreateChannel } from "@/entities/channel/api/hooks";
import { useAuthStore } from "@/shared/store/auth.store";
import { Button } from "@/shared/ui/button";
import Input from "@/shared/ui/input";
import Textarea from "@/shared/ui/textarea";

import { FC } from "react";
import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";

const schema = yup
  .object({
    title: yup.string().required(),
    slug: yup.string().required(),
    description: yup.string().required(),
  })
  .required();
type FormDataType = yup.InferType<typeof schema>;

interface Props {
  onSuccess?: (data: any) => void;
}

const CreateChannelForm: FC<Props> = ({ onSuccess }) => {
  const { user } = useAuthStore();

  const { createChannel, isPending } = useCreateChannel(onSuccess);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = (data: FormDataType) => {
    if (!user) {
      setError("root", { message: "Unauthorized" });
      return;
    }
    createChannel({
      title: data.title,
      description: data.description,
      slug: data.slug,
      userId: user.id,
    });
  };

  if (!user) return <p>Have no access</p>;

  return (
    <div>
      <form
        className="flex flex-col gap-5 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          containerClassName="w-full"
          label="Title"
          error={errors.title?.message}
          {...register("title")}
        />

        <Input
          containerClassName="w-full"
          label="Slug"
          error={errors.title?.message}
          {...register("slug")}
        />

        <Textarea
          containerClassName="w-full"
          label="Description"
          error={errors.description?.message || errors.root?.message}
          {...register("description")}
        />

        <Button
          disabled={isPending}
          className="w-full mt-2 bg-accent hover:bg-accent/90"
          type="submit"
        >
          {isPending ? "Creating..." : "Create"}
        </Button>
      </form>
    </div>
  );
};

export default CreateChannelForm;
