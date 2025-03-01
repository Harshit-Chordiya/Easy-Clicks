import { Period } from "@/types/analytics";
import { clsx, type ClassValue } from "clsx";
import { endOfMonth, intervalToDuration, startOfMonth } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function datesToDurationString(
  end: Date | null | undefined,
  start: Date | null | undefined,
) {
  if (!end || !start) return null;

  const timeElapsed = end.getTime() - start.getTime();
  if (timeElapsed < 1000) {
    return `${timeElapsed}ms`;
  }

  const duration = intervalToDuration({
    start: 0,
    end: timeElapsed,
  });

  return `${duration.minutes || 0}m ${duration.seconds || 0}s`;
}

export function getAppUrl(path: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  return `${appUrl}${path}`;
}

export function periodToDateRange(period: Period) {
  const startDate = startOfMonth(new Date(period.year, period.month, 1));
  const endDate = endOfMonth(new Date(period.year, period.month, 1));
  return { startDate, endDate };
}
