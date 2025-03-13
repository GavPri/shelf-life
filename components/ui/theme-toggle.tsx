"use client";

import { useState, useEffect } from "react";
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Monitor } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as "light" | "dark" | "system" | null;

    if (storedTheme) {
      setTheme(storedTheme);
    }

    applyTheme(storedTheme || "system");
  }, []);

  const applyTheme = (selectedTheme: "light" | "dark" | "system") => {
    document.body.classList.remove("light", "dark");

    if (selectedTheme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.body.classList.add(prefersDark ? "dark" : "light");
    } else {
      document.body.classList.add(selectedTheme);
    }
  };

  const handleThemeChange = (selectedTheme: "light" | "dark" | "system") => {
    setTheme(selectedTheme);
    localStorage.setItem("theme", selectedTheme);
    applyTheme(selectedTheme);
    setIsOpen(false);
  };

  return (
    <>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline">Theme</Button>
        </DrawerTrigger>
        <DrawerContent className="p-4 space-y-4">
          <h2 className="text-lg font-semibold text-center">Select Theme</h2>
          <div className="flex flex-col space-y-2">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              onClick={() => handleThemeChange("light")}
            >
              <Sun className="w-5 h-5 mr-2" />
              Light
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              onClick={() => handleThemeChange("dark")}
            >
              <Moon className="w-5 h-5 mr-2" />
              Dark
            </Button>
            <Button
              variant={theme === "system" ? "default" : "outline"}
              onClick={() => handleThemeChange("system")}
            >
              <Monitor className="w-5 h-5 mr-2" />
              System
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
