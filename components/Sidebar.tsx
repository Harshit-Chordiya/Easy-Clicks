"use client"
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { HomeIcon, Layers2Icon, ShieldCheckIcon, CoinsIcon, MenuIcon } from "lucide-react";
import Logo from "./Logo";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "./ui/sheet";
import AvailableCreditsBadge from "./UserAvaiableCreditsBadge";

const routes = [
    {
        href: "/",
        label: "Home",
        icon: HomeIcon,
    },
    {
        href: "workflows",
        label: "Workflows",
        icon: Layers2Icon,
    },
    {
        href: "credentials",
        label: "Credentials",
        icon: ShieldCheckIcon,
    },
    {
        href: "billing",
        label: "Billing",
        icon: CoinsIcon,
    },
];

export function DesktopSidebar() {
    const pathname = usePathname();

    return (
        <div className="relative hidden h-screen w-full min-w-[280px] max-w-[280px] border-separate overflow-hidden border-r-2 bg-primary/5 text-muted-foreground dark:bg-secondary/30 dark:text-foreground md:block">
            <div className="flex border-separate items-center justify-center gap-2 border-b-[1px] p-4">
                <Logo />
            </div>
            <div className="p-2">
                <AvailableCreditsBadge />
            </div>
            <div className="flex flex-col p-2">
                {routes.map((route) => (
                    // Link styled to look like a Button via the buttonVariants cva function.
                    // Alternatively, a more idiomatic approach would be to use a Button with asChild prop.
                    <Link
                        key={route.href}
                        href={route.href}
                        className={buttonVariants({
                            variant:
                                route.href === pathname ? "sidebarActiveItem" : "sidebarItem",
                        })}
                    >
                        <route.icon size={20} />
                        {route.label}
                    </Link>
                ))}
            </div>
        </div>
    );
}

export function MobileSidebar() {
    const [isOpen, setOpen] = useState(false);
    const pathname = usePathname();

    return (
        <div className="block border-separate bg-background md:hidden">
            <nav className="mr-8 flex items-center justify-between">
                <Sheet open={isOpen} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MenuIcon />
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="w-full max-w-sm space-y-4" side="left">
                        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                        <SheetDescription className="sr-only">
                            Access different sections of FlowScrape
                        </SheetDescription>
                        <Logo />
                        <AvailableCreditsBadge />
                        <div className="flex flex-col gap-1">
                            {routes.map((route) => (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    className={buttonVariants({
                                        variant:
                                            route.href === pathname
                                                ? "sidebarActiveItem"
                                                : "sidebarItem",
                                    })}
                                    onClick={() => setOpen((s) => !s)}
                                >
                                    <route.icon size={20} />
                                    {route.label}
                                </Link>
                            ))}
                        </div>
                    </SheetContent>
                </Sheet>
            </nav>
        </div>
    );
}
