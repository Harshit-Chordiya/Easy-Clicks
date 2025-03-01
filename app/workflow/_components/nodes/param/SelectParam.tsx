"use client";

import { ParamProps } from "@/types/appNode";
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useId } from "react";
import { Label } from "@/components/ui/label";

type OptionType = {
  label: string;
  value: string;
};

export default function SelectParam({
  param,
  updateNodeParamValues,
  value,
}: ParamProps) {
  const id = useId();
  return (
    <div className="flex w-full flex-col gap-1">
      <Label htmlFor={id} className="flex text-xs">
        {param.name}
        {param.required && <p className="px-2 text-red-400">*</p>}
      </Label>
      <Select
        onValueChange={(value) => updateNodeParamValues(value)}
        defaultValue={value}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Options</SelectLabel>
            {param.options.map((option: OptionType) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
