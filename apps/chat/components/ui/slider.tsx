"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: number[];
  onValueChange?: (value: number[]) => void;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value = [0], onValueChange, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(event.target.value);
      onValueChange?.([newValue]);
    };

    return (
      <input
        ref={ref}
        type="range"
        value={value[0]}
        onChange={handleChange}
        className={cn(
          "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer",
          "range-slider",
          className
        )}
        {...props}
      />
    );
  }
);
Slider.displayName = "Slider";

export { Slider };
