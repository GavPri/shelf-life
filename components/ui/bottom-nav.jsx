"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Apple, PlusCircle, AlertCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useUser();
  const userId = user.id;

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
    },
    {
      name: "Inventory",
      href: `/food-list/${userId}`,
      icon: Apple,
    },
    {
      name: "Add Item",
      href: `/add-food/${userId}`,
      icon: PlusCircle,
    },
    {
      name: "Expiring Soon",
      href: "/expiring",
      icon: AlertCircle,
    },
    {
      name: "Profile",
      href: `/profile/${userId}`,
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full border-t bg-background h-24">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center",
                isActive ? "text-green-500" : "text-muted-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "h-6 w-6",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />
              <span className="mt-1 text-xs sr-only">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
