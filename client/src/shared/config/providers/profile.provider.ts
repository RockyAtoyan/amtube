"use client";

import { useGetProfile } from "@/entities/user/api/hooks";

import React from "react";

const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  useGetProfile();

  return children;
};

export default ProfileProvider;
