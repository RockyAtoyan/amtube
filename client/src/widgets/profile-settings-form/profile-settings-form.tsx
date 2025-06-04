"use client";

import { useSendActivateEmail, useUpdateUser } from "@/entities/user/api/hooks"
import { useUploadMedia } from "@/shared/lib/hooks/useUploadMedia"
import { useAuthStore } from "@/shared/store/auth.store"
import Badge from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import Input from "@/shared/ui/input"
import { Loader } from "@/shared/ui/loader"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

import { yupResolver } from "@hookform/resolvers/yup"

import * as yup from "yup"

import ProfileSettingsAvatar from "./profile-settings-avatar"

const schema = yup
  .object({
    name: yup.string().required(),
    email: yup.string().required(),
    password: yup.string(),
  })
  .required();
type FormDataType = yup.InferType<typeof schema>;

const ProfileSettingsForm = () => {
  const { user, isPending } = useAuthStore();

  const { uploadMedia, isMediaUploading } = useUploadMedia();
  const { updateUser, isPending: isUpdatePending } = useUpdateUser();
  const { sendActivateEmail, isPending: isSendingPending } =
    useSendActivateEmail();

  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const initLoading = isPending || !user;
  const uploadingLoading =
    isMediaUploading || isUpdatePending || isSendingPending;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user?.name || "",
        email: user?.email || "",
        password: "",
      });
    }
  }, [user]);

  const onSubmit = async (data: FormDataType) => {
    if (!user) return;
    try {
      const avatarUrl =
        avatarFile &&
        (await uploadMedia({
          uploadPath: "/users-avatars",
          filename: user.id,
          file: avatarFile,
        }));

      await updateUser(
        {
          id: user.id,
          dto: {
            email: data.email,
            name: data.name,
            password: data.password || undefined,
            avatarUrl: avatarUrl || undefined,
          },
        },
        {
          onSuccess(data, variables, context) {
            toast.success("Saved!");
            setAvatarFile(null);
          },
        },
      );
    } catch (error) {
      toast.error("An error occurred during uploading thumbnail. Try again!");
    }
  };

  if (initLoading) {
    return <Loader className="h-full" />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full flex items-center justify-between gap-5 py-3 border-b border-border">
        <h2 className="text-xl">Profile Settings</h2>
        <div className="flex items-center gap-5">
          {user.isActivated ? (
            <Badge>Activated</Badge>
          ) : (
            <>
              <Badge variant="error">No activated</Badge>
              <Button
                disabled={uploadingLoading}
                type="button"
                variant="secondary"
                onClick={() => {
                  sendActivateEmail(user.id, {
                    onSuccess(data) {
                      if (data.success) {
                        toast.success(
                          "Mail with activation link sended on your email!",
                        );
                      } else {
                        toast.error("Something went wrong, try again!");
                      }
                    },
                  });
                }}
              >
                Activate
              </Button>
            </>
          )}
          <div className="w-[2px] h-10 bg-border"></div>
          <Button
            type="button"
            disabled={uploadingLoading}
            variant={"outline"}
            onClick={() => {
              reset({
                name: user?.name || "",
                email: user?.email || "",
                password: "",
              });
              setAvatarFile(null);
              toast.success("Canceled!");
            }}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={uploadingLoading}>
            Save
          </Button>
        </div>
      </div>
      <div className="mt-5">
        <ProfileSettingsAvatar
          avatarFile={avatarFile}
          setAvatarFile={setAvatarFile}
        />
      </div>
      <div className="mt-5">
        <p className="text-lg mb-5">User's Email</p>
        <Input
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>
      <div className="mt-5">
        <p className="text-lg mb-5">User's Name</p>
        <Input
          label="Name"
          error={errors.name?.message}
          {...register("name")}
        />
      </div>
      <div className="mt-5">
        <p className="text-lg mb-5">User's password</p>
        <Input
          label="New password"
          type="password"
          error={errors.password?.message}
          {...register("password")}
        />
      </div>
    </form>
  );
};

export default ProfileSettingsForm;
