import Header from "@/components/common/dashboard/Header";
import SidebarNav from "@/components/common/dashboard/SidebarNav";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen">
      <Header />
      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar navigation */}
        <div className="hidden lg:block w-[15%] fixed top-[72px] left-0 h-[calc(100vh-64px)] bg-gray-800 z-40 ">
          <SidebarNav />
        </div>
 
        {/* Main content area */}
        <main className="ml-[15%] w-[85%] p-4 h-[calc(100vh-64px)]">{children}</main>
      </div>
    </div>
  );
}
