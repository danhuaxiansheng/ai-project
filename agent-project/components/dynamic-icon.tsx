"use client";

import { Icon } from "@iconify/react";
import { HTMLAttributes, useState } from "react";
import { cn } from "@/lib/utils";

interface DynamicIconProps extends HTMLAttributes<HTMLSpanElement> {
  name: string;
  width?: number | string;
  height?: number | string;
}

export function DynamicIcon({
  name,
  width = "1em",
  height = "1em",
  className,
  ...props
}: DynamicIconProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center",
        isLoading && "animate-pulse",
        className
      )}
      style={{ width, height }}
      {...props}
    >
      <Icon
        icon={name}
        width={width}
        height={height}
        onLoad={() => {
          setIsLoading(false);
          setHasError(false);
        }}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
          console.warn(`Failed to load icon: ${name}`);
        }}
      />
      {isLoading && (
        <span
          className="absolute inset-0 bg-muted rounded-sm"
          style={{ width, height }}
        />
      )}
      {hasError && (
        <span
          className="absolute inset-0 flex items-center justify-center bg-muted rounded-sm text-muted-foreground"
          style={{ width, height }}
        >
          ?
        </span>
      )}
    </span>
  );
}
