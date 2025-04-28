'use client';

import {useEffect, useState} from 'react';
import {useRouter, usePathname} from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard,
    Package,
    Tags,
    BadgePercent,
    Users,
    Settings,
    LogOut,
    ChevronDown,
    Menu
} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Sheet, SheetContent, SheetTrigger} from '@/components/ui/sheet';
import {supabase} from '@/lib/supabase';
import {cn} from '@/lib/utils';

const sidebarItems = [
    {
        title: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard
    },
    {
        title: 'Products',
        href: '/admin/products',
        icon: Package
    },
    // {
    //     title: 'Categories',
    //     href: '/admin/categories',
    //     icon: Tags
    // },
    // {
    //     title: 'Orders',
    //     href: '/admin/orders',
    //     icon: BadgePercent
    // },
    // {
    //     title: 'Customers',
    //     href: '/admin/customers',
    //     icon: Users
    // },
    // {
    //     title: 'Settings',
    //     href: '/admin/settings',
    //     icon: Settings
    // }
];

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        setIsMounted(true);

        const checkAuth = async () => {
            const {data: {session}} = await supabase.auth.getSession();

            if (!session) {
                router.push('/admin/login');
            }
        };

        checkAuth();
    }, [router]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
    };

    if (!isMounted) {
        return null;
    }

    const Sidebar = () => (
        <div className="space-y-4 py-4">
            <div className="px-3 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold">Admin Dashboard</h2>
                <div className="space-y-1">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                                pathname === item.href ? "bg-accent" : "transparent",
                            )}
                        >
                            <item.icon className="mr-2 h-4 w-4"/>
                            {item.title}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen">
            {/* Sidebar for desktop */}
            <div className="hidden border-r bg-gray-100/40 lg:block lg:w-60">
                <ScrollArea className="h-full py-6">
                    <Sidebar/>
                </ScrollArea>
            </div>

            {/* Mobile navigation */}
            <div className="flex flex-col w-full">
                <header
                    className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6 lg:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="lg:hidden">
                                <Menu className="h-6 w-6"/>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-60 p-0">
                            <Sidebar/>
                        </SheetContent>
                    </Sheet>
                    <div className="flex-1">
                        <h1 className="text-lg font-semibold">Admin Dashboard</h1>
                    </div>
                </header>

                <div className="flex-1">
                    <div className="border-b bg-background">
                        <div className="flex h-16 items-center gap-4 px-6">
                            <div className="flex-1">
                                <h1 className="text-lg font-semibold hidden lg:block">
                                    Admin Dashboard
                                </h1>
                            </div>
                            <Button variant="ghost" size="icon" onClick={handleSignOut}>
                                <LogOut className="h-5 w-5"/>
                            </Button>
                        </div>
                    </div>
                    <main className="flex-1 p-6">{children}</main>
                </div>
            </div>
        </div>
    );
}