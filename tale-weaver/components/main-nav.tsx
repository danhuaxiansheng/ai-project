"use client";

import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { Pen } from "lucide-react";

export function MainNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <Pen className="h-5 w-5" />
          <span className="text-xl">Tale Weaver</span>
        </Link>
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
