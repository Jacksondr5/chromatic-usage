"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "~/components/ui/button";

export const Menu = () => {
  const currentRoute = usePathname();
  const otherPageHref = currentRoute === "/settings" ? "/" : "/settings";
  const otherPageName = currentRoute === "/settings" ? "Home" : "Settings";
  return (
    <Button variant="link" className="absolute right-2 top-2">
      <Link href={otherPageHref}>{otherPageName}</Link>
    </Button>
  );
};
