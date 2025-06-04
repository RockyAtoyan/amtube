"use client";

import { useUpdateChannel } from "@/entities/channel/api/hooks";
import CreateChannelForm from "@/features/create-channel-form/create-channel-form";
import { PublicRoutes } from "@/shared/config/routes/public.routes";
import { useUploadMedia } from "@/shared/lib/hooks/useUploadMedia";
import { useAuthStore } from "@/shared/store/auth.store";
import { Button } from "@/shared/ui/button";
import HtmlEditor from "@/shared/ui/html-editor/html-editor";
import Input from "@/shared/ui/input";
import { Loader } from "@/shared/ui/loader";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { yupResolver } from "@hookform/resolvers/yup";

import Link from "next/link";
import * as yup from "yup";

import ChannelSettingsAvatar from "./channel-settings-avatar";
import ChannelSettingsBanner from "./channel-settings-banner";

const schema = yup
  .object({
    title: yup.string().required(),
    slug: yup.string().required(),
    description: yup.string().required(),
  })
  .required();
type FormDataType = yup.InferType<typeof schema>;

const ChannelSettingsForm = () => {
  const { user, isPending } = useAuthStore();

  const { uploadMedia, isMediaUploading } = useUploadMedia();
  const { updateChannel, isPending: isUpdatePending } = useUpdateChannel();

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const loading = isMediaUploading || isUpdatePending;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    control,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: user?.channel?.title || "",
      slug: user?.channel?.slug || "",
      description: user?.channel?.description || "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        title: user?.channel?.title || "",
        slug: user?.channel?.slug || "",
        description: user?.channel?.description || "",
      });
    }
  }, [user]);

  const onSubmit = async (data: FormDataType) => {
    if (!user?.channel) return;
    try {
      const avatarUrl =
        avatarFile &&
        (await uploadMedia({
          uploadPath: "/channels-avatars",
          filename: user.channel.id,
          file: avatarFile,
        }));

      const bannerUrl =
        bannerFile &&
        (await uploadMedia({
          uploadPath: "/channels-banners",
          filename: user.channel.id,
          file: bannerFile,
        }));

      await updateChannel(
        {
          id: user.channel.id,
          dto: {
            title: data.title,
            description: data.description,
            slug: data.slug,
            userId: user.id,
            avatarUrl: avatarUrl || undefined,
            bannerUrl: bannerUrl || undefined,
          },
        },
        {
          onSuccess(data, variables, context) {
            toast.success("Published!");
            setAvatarFile(null);
            setBannerFile(null);
          },
        },
      );
    } catch (error) {
      toast.error("An error occurred during uploading thumbnail. Try again!");
    }
  };

  if (!user?.channel && isPending) {
    return <Loader className="h-full" />;
  }

  if (!user?.channel && !isPending)
    return (
      <div>
        <p className="mb-8 text-lg">First you need to create channel!</p>
        <div className="max-w-md">
          <CreateChannelForm />
        </div>
      </div>
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full flex items-center justify-between gap-5 py-3 border-b border-border">
        <h2 className="text-xl">Channel Settings</h2>
        <div className="flex items-center gap-5">
          <Button type="button" disabled={loading} variant="ghost" asChild>
            <Link href={PublicRoutes.CHANNEL(user!.channel!.slug)}>
              Move to channel page
            </Link>
          </Button>
          <Button
            type="button"
            disabled={loading}
            variant={"outline"}
            onClick={() => {
              reset({
                title: user?.channel?.title || "",
                slug: user?.channel?.slug || "",
                description: user?.channel?.description || "",
              });
              setAvatarFile(null);
              setBannerFile(null);
              toast.success("Canceled!");
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            Publish
          </Button>
        </div>
      </div>
      <div className="mt-5">
        <ChannelSettingsAvatar
          avatarFile={avatarFile}
          setAvatarFile={setAvatarFile}
        />
      </div>
      <div className="mt-5">
        <ChannelSettingsBanner
          bannerFile={bannerFile}
          setBannerFile={setBannerFile}
        />
      </div>
      <div className="space-y-6 mt-5">
        <div className="mt-5">
          <p className="text-lg">Channel's Title</p>
          <p className="text-sm text-primary/70 mb-5">
            Come up with a channel name that represents you and your content.
          </p>
          <Input
            label="Title"
            error={errors.title?.message}
            {...register("title")}
          />
        </div>
        <div className="mt-5">
          <p className="text-lg">Channel's Slug</p>
          <p className="text-sm text-primary/70 mb-5">
            Create a unique name using letters and numbers, it will be displayed
            in the search bar.
          </p>
          <Input
            label="Slug"
            error={errors.title?.message}
            {...register("slug")}
          />
        </div>
        <div className="mt-5">
          <p className="text-lg mb-5">Channel's Description</p>
          <Controller
            name="description"
            control={control}
            render={({ field }) => {
              return (
                <HtmlEditor
                  placeholder="Channel's description"
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                />
              );
            }}
          />
          {errors.description?.message && (
            <p className="mt-2 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>
      </div>
    </form>
  );
};

export default ChannelSettingsForm;
