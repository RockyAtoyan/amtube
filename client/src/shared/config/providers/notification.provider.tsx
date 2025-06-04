"use client";

import { useAuthStore } from "@/shared/store/auth.store"

import { useEffect } from "react"
import toast from "react-hot-toast"

import { useQueryClient } from "@tanstack/react-query"

import { Info } from "lucide-react"
import Link from "next/link"
import { io } from "socket.io-client"

const socket = io(process.env.NEXT_PUBLIC_API_URL + "/server", {
  secure: process.env.NODE_ENV === "development",
});

const NotificationProvider = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    const userId = user?.id;
    if (userId) {
      socket.removeAllListeners("message");
      socket.emit("joining", { userId });
      socket.on("joining", (data) => {
        if (data.type === "joining" && data.success) {
          console.log("Connecton is established.");
        }
      });
      socket.on("message", (data) => {
        data &&
          toast((t) => (
            <Link href={data.text} className="flex items-center gap-3">
              <Info size={20} className="text-blue-500 flex-shrink-0" />
              <span className="line-clamp-2">{data.text} </span>
            </Link>
          ));
        queryClient.invalidateQueries({ queryKey: ["profile"] });
      });
    }
  }, [user?.id]);

  return null;
};

export default NotificationProvider;
