"use client";

import { useMounted } from "@/hooks/use-mounted";
import React from "react";
import CountUp from "react-countup";


export default function ReactCountUpWrapper({ value }: { value: number }) {
  const mounted = useMounted();
  if (!mounted) return "-";

  return <CountUp duration={0.5} preserveValue end={value} decimals={0} />;
}
