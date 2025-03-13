"use client";

import { UserButton } from "@clerk/nextjs";
import { Hourglass } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function TopNav() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between bg-background p-4 shadow-sm">
      <div className="flex items-center">
        <Link href="/">
          <h1 className="font-semibold text-xl inline-flex items-center">Shelf Life <Hourglass className="ml-4" size={20}/></h1>
        </Link>
      </div>
      <div className="flex items-center">
        <UserButton />
      </div>
    </nav>
  );
}
