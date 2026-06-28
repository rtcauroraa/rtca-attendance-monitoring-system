import { Link } from '@inertiajs/react';
import {
    BookOpen,
    FolderGit2,
    LayoutGrid,
    NotebookIcon,
    Scan,
    ScanBarcodeIcon,
    User,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard, trainees, attendance, scanner, personnel } from '@/routes';
import type { NavItem } from '@/types';
import { usePage } from '@inertiajs/react';

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props as any;

    const roles = auth?.user?.roles ?? [];

    const roleNames = roles.map((r: any) => r.name);
    const isAdmin = roles[0].name === 'Admin';
    const isUser = roleNames.includes('User');
    const isAlpha = roleNames.includes('Alpha');
    const isBravo = roleNames.includes('Bravo');
    const isCharlie = roleNames.includes('Charlie');
    const isDelta = roleNames.includes('Delta');

    const canAccessScanner = roleNames.some((r: string) =>
        ['User', 'Alpha', 'Bravo', 'Charlie', 'Delta'].includes(r),
    );
    const mainNavItems: NavItem[] = [
        ...(isAdmin
            ? [
                  {
                      title: 'Dashboard',
                      href: dashboard(),
                      icon: LayoutGrid,
                  },
                  {
                      title: 'Users',
                      href: '/user',
                      icon: User,
                  },
                  {
                      title: 'Trainees',
                      href: trainees(),
                      icon: User,
                  },
                  //   {
                  //       title: 'Attendance',
                  //       href: attendance(),
                  //       icon: User,
                  //   },
                  //   {
                  //       title: 'Personnel',
                  //       href: '/personnels',
                  //       icon: User,
                  //   },
                  {
                      title: 'Passes',
                      href: '/ashore-passes',
                      icon: NotebookIcon,
                  },
              ]
            : []),

        ...(canAccessScanner
            ? [
                  {
                      title: 'Scanner',
                      href: '/scanner',
                      icon: ScanBarcodeIcon,
                  },
              ]
            : []),
    ];
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
