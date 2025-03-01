"use client";

import React from "react";
import MobileSidebar from "./Sidebar";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

export default function BreadcrumbHeader() {
  const pathname = usePathname();
  const paths = pathname === "/" ? [""] : pathname.split("/");

  return (
    <div className="flex items-center">
      <MobileSidebar />
      <Breadcrumb>
        <BreadcrumbList>
          {paths.map((path, index) => (
            <React.Fragment key={index}>
              {index !== 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link className="capitalize" href={`/${path}`}>
                    {path === "" ? "home" : path}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
