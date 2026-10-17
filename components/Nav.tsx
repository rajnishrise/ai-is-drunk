"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { rooms } from "@/lib/rooms";

export default function Nav() {
  const path = usePathname();
  return (
    <header className="topbar">
      <div className="wrap">
        <Link href="/" className="logo">AI IS DRUNK</Link>
        <nav className="rooms" aria-label="Rooms">
          {rooms.map((r) => (
            <Link key={r.href} href={r.href} aria-current={path === r.href ? "page" : undefined}>
              {r.short}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
