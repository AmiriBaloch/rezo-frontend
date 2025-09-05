"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

// React Icons
import {
  BiHome,
  BiUser,
  BiMessageSquareDots,
  BiChevronDown,
  BiChevronUp,
  BiArrowToTop,
} from "react-icons/bi";
import { LiaSignOutAltSolid } from "react-icons/lia";
import { MdOutlineAddHome, MdOutlineAddHomeWork } from "react-icons/md";
import { SiBittorrent, SiGoogletagmanager } from "react-icons/si";
import { FaRupeeSign, FaMagnifyingGlassChart } from "react-icons/fa6";
import { GrResources } from "react-icons/gr";
import { VscReferences } from "react-icons/vsc";
import { GiThreeFriends } from "react-icons/gi";
import { MdAssignmentInd, MdConstruction, MdGavel } from "react-icons/md";

const menuItems = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: BiHome,
  },
  {
    title: "Owner Dashboard",
    path: "/owner",
    icon: BiHome,
  },
  {
    section: "Real Estate",
    links: [
      { title: "Manage", path: "/manage", icon: SiGoogletagmanager },
      {
        title: "Property Applications",
        path: "/property-applications",
        icon: MdAssignmentInd,
      },
    ],
  },
  {
    section: "Earn Sphere",
    links: [
      { title: "Earnings", path: "/earnings", icon: FaRupeeSign },
      { title: "Resources", path: "/resources", icon: GrResources },
      { title: "Refer a Host", path: "/refer-host", icon: VscReferences },
    ],
  },
  {
    section: "Operational",
    links: [
      { title: "Matrics", path: "/matrics", icon: FaMagnifyingGlassChart },
      { title: "Team", path: "/team", icon: GiThreeFriends },

      { title: "Builder Panel", path: "/builder", icon: MdConstruction },
      { title: "Builder Management", path: "/admin/builder-management", icon: MdConstruction },
      { title: "Ownership Requests", path: "/admin/ownership-requests", icon: MdGavel },
      { title: "Builder Requests", path: "/admin/builder-requests", icon: MdConstruction },
    ],
  },
  {
    section: "Settings",
    links: [
      { title: "Profile", path: "/profile", icon: BiUser },
      { title: "Messages", path: "/messages", icon: BiMessageSquareDots },
      { title: "Sign Out", path: "/sign-out", icon: LiaSignOutAltSolid },
    ],
  },
];

export default function SidebarNav() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({});

  // Handle mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-expand section if active route found
  useEffect(() => {
    const newCollapsed = { ...collapsedSections };
    let updated = false;

    menuItems.forEach((item) => {
      if (item.section) {
        const hasActive = item.links.some((link) =>
          pathname.startsWith(link.path)
        );
        if (hasActive && newCollapsed[item.section] !== false) {
          newCollapsed[item.section] = false;
          updated = true;
        }
      }
    });

    if (updated) setCollapsedSections(newCollapsed);
  }, [pathname]);

  const toggleSection = (section) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <aside className="w-full h-screen bg-secondary p-4 flex flex-col gap-6 overflow-y-auto border-t">
      {menuItems.map((item, index) => {
        if (item.section) {
          const isCollapsed = collapsedSections[item.section] ?? false;

          return (
            <div key={index} className="flex flex-col gap-2">
              <button
                onClick={() => toggleSection(item.section)}
                className="flex items-center justify-between text-sm text-gray-400 font-medium hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-2">
                  {isMobile ? item.section.charAt(0) : item.section}
                </div>
                {isCollapsed ? (
                  <BiChevronDown className="text-gray-300 text-lg" />
                ) : (
                  <BiChevronUp className="text-gray-300 text-lg" />
                )}
              </button>

              {!isCollapsed && (
                <div className="flex flex-col gap-1.5 pl-2">
                  {item.links.map((link, idx) => {
                    const isActive = pathname.startsWith(link.path);
                    const Icon = link.icon;

                    return (
                      <div key={idx}>
                        <Link
                          href={link.path}
                          className={`flex items-center gap-3 p-2 rounded-md transition-colors ${
                            isActive
                              ? "bg-primary text-secondary"
                              : "text-gray-300 hover:bg-hoverprimary"
                          }`}
                        >
                          <Icon className="text-xl" />
                          {!isMobile && (
                            <span className="text-sm font-medium">{link.title}</span>
                          )}
                        </Link>
                        {/* Render subLinks if present */}
                        {link.subLinks && !isCollapsed && (
                          <div className="flex flex-col gap-1.5 pl-6">
                            {link.subLinks.map((subLink, subIdx) => {
                              const isSubActive = pathname.startsWith(subLink.path);
                              const SubIcon = subLink.icon;
                              return (
                                <Link
                                  key={subIdx}
                                  href={subLink.path}
                                  className={`flex items-center gap-3 p-2 rounded-md transition-colors ${
                                    isSubActive
                                      ? "bg-primary text-secondary"
                                      : "text-gray-300 hover:bg-hoverprimary"
                                  }`}
                                >
                                  <SubIcon className="text-lg" />
                                  {!isMobile && (
                                    <span className="text-sm font-medium">{subLink.title}</span>
                                  )}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        } else {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={index}
              href={item.path}
              className={`flex items-center gap-3 p-2 rounded-md transition-colors ${
                isActive
                  ? "bg-primary text-secondary"
                  : "text-gray-300 hover:bg-hoverprimary"
              }`}
            >
              <Icon className="text-xl" />
              {!isMobile && (
                <span className="text-sm font-medium">{item.title}</span>
              )}
            </Link>
          );
        }
      })}

      {isMobile && (
        <div className="mt-auto border-t pt-4">
          <button
            onClick={() => {
              const allCollapsed =
                Object.values(collapsedSections).every(Boolean);
              const newState = Object.fromEntries(
                menuItems
                  .filter((item) => item.section)
                  .map((item) => [item.section, !allCollapsed])
              );
              setCollapsedSections(newState);
            }}
            className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 w-full justify-center"
          >
            <BiArrowToTop className="text-sm" />
            {Object.values(collapsedSections).every(Boolean)
              ? "Expand All"
              : "Collapse All"}
          </button>
        </div>
      )}
    </aside>
  );
}
