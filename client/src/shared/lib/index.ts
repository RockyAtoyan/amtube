import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const getChannelLogoLetters = (title: string): string => {
  if (!title) return "";
  const words = title.split(" ");
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return (words[0][0] + words[1][0]).toUpperCase();
};

export const formatNumber = (num: number, digits = 1) => {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "B" },
    { value: 1e12, symbol: "T" },
  ];

  const item = lookup
    .slice()
    .reverse()
    .find((item) => num >= item.value);
  if (digits === 1) {
    if (item) {
      const res = (num / item.value).toFixed(digits);
      const resNumbers = res.split(".");
      if (resNumbers[1] === "0") return resNumbers[0];
      return res;
    }
    return "0";
  }
  return item ? (num / item.value).toFixed(digits) + item.symbol : "0";
};

export const formatDateRelative = (
  date: Date | string,
  nowDate: Date = new Date(),
) => {
  const targetDate = new Date(date);
  const diffInSeconds = Math.floor(
    (nowDate.getTime() - targetDate.getTime()) / 1000,
  );

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
  }

  if (targetDate.getFullYear() === nowDate.getFullYear()) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const day = targetDate.getDate();
    const month = monthNames[targetDate.getMonth()];
    return `${day} ${month}`;
  }

  const day = targetDate.getDate();
  const month = targetDate.getMonth() + 1;
  const year = targetDate.getFullYear();
  return `${day.toString().padStart(2, "0")}.${month.toString().padStart(2, "0")}.${year}`;
};
