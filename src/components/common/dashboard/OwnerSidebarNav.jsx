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


const ownerMenuItems = [
  {
    title: "Dashboard",
    path: "/owner",
    icon: BiHome,
  },
  {
    section: "Property Management",
    links: [
      {
        title: "Sale Property",
        path: "/owner/sale-property",
        icon: MdOutlineAddHome,
      },
      {
        title: "Rent Property",
        path: "/owner/rent-property",
        icon: MdOutlineAddHomeWork,
      },
    ],
  },
];

export default function OwnerSidebarNav() {
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

    ownerMenuItems.forEach((item) => {
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
      {ownerMenuItems.map((item, index) => {
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
                      <Link
                        key={idx}
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
                ownerMenuItems
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
