"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { PlusCircle } from "lucide-react";

export default function Home() {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return null;

  return (
    <>
      <p>ShelfLife</p>
      <p>Welcome back, {user?.firstName} </p>
      <p>{user?.id}</p>
      <Link href={`/add-food/${user?.id}`}>
        <Button>Add Food <PlusCircle /></Button>
      </Link>
      {!isSignedIn && (
        <>
          <Link href="/sign-up">
            <Button>Sign Up</Button>
          </Link>
          <Link href="/sign-in">
            <Button>Sign In</Button>
          </Link>
        </>
      )}
    </>
  );
}
