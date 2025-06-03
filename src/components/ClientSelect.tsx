"use client";

import React from "react";
import Select from "react-select";

export default function ClientSelect({ options, value, onChange }: any) {
  console.log("ClientSelect options:", value);
  return (
    <Select
      options={options}
      value={options.find((opt: any) => opt.value === value) || null}
      onChange={(selectedOption: any) => onChange(selectedOption?.value || "")}
      isSearchable
      className="w-full"
    />
  );
}
