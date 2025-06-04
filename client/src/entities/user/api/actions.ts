"use server";

import {
  SignInDto,
  SignUpDto,
  ToggleChannelSubscribeDto,
  UpdateUserDto,
  UsersApi,
} from "./api";

export async function signUp(dto: SignUpDto) {
  try {
    const res = await UsersApi.signUp(dto);
    return res;
  } catch (error) {
    throw new Error("Failed to sign up");
  }
}

export async function signIn(dto: SignInDto) {
  try {
    const res = await UsersApi.signIn(dto);
    return res;
  } catch (error) {
    throw new Error("Failed to sign in");
  }
}

export async function logout() {
  try {
    const res = await UsersApi.logout();
    return res;
  } catch (error) {
    throw new Error("Failed to logout");
  }
}

export async function updateUser(id: string, dto: UpdateUserDto) {
  try {
    const res = await UsersApi.update(id, dto);
    return res;
  } catch (error) {
    throw new Error("Failed to update user");
  }
}

export async function toggleChannelSubscribe(dto: ToggleChannelSubscribeDto) {
  try {
    const res = await UsersApi.toggleChannelSubscribe(dto);
    return res;
  } catch (error) {
    throw new Error("Failed to toggle channel subscription");
  }
}

export async function getUserHistory() {
  try {
    const res = await UsersApi.getUserHistory();
    return res;
  } catch (error) {
    throw new Error("Failed to get user history");
  }
}

export async function getUserSubscribesVideos() {
  try {
    const res = await UsersApi.getUserSubscribesVideos();
    return res;
  } catch (error) {
    throw new Error("Failed to get subscribed videos");
  }
}
