"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Header() {
  const router = useRouter();

  return (
    <header className="w-full flex justify-between items-center bg-secondary px-4 sm:px-6 md:px-8 lg:px-12 py-3 sticky top-0 z-40">
      <Link href="/dashboard">
        <img src="/Logo/logo.png" alt="Company Logo" className="w-14" />
      </Link>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <img
            src="https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png"
            alt="User profile"
            className="w-8 h-8 sm:w-9 sm:h-9 border-2 border-primary rounded-full object-cover"
          />
          <div className="hidden sm:block text-left">
            <h4 className="text-sm font-medium text-primary">Diky</h4>
            <h5 className="text-xs font-normal text-hoverprimary">Admin</h5>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
