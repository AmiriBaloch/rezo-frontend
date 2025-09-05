import OwnerHeader from "@/components/common/dashboard/OwnerHeader";
import OwnerSidebarNav from "@/components/common/dashboard/OwnerSidebarNav";

export default function OwnerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen">
      <OwnerHeader />
      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar navigation */}
        <div className="hidden lg:block w-[15%] fixed top-[72px] left-0 h-[calc(100vh-64px)] bg-secondary z-40 ">
          <OwnerSidebarNav />
        </div>
 
        {/* Main content area */}
        <main className="ml-[15%] w-[85%] p-4 h-[calc(100vh-64px)]">{children}</main>
      </div>
    </div>
  );
}
