import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Building2,
    FolderGit2,
    LayoutGrid,
    Settings2,
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
import { useTranslations } from '@/hooks/use-translations';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';
import type { Auth } from '@/types/auth';

export function AppSidebar() {
    const { t } = useTranslations();
    const { auth } = usePage<{ auth: Auth }>().props;

    const footerNavItems: NavItem[] = [
        {
            title: t('layout.sidebar.repository', 'Repository'),
            href: 'https://github.com/laravel/react-starter-kit',
            icon: FolderGit2,
        },
        {
            title: t('layout.sidebar.documentation', 'Documentation'),
            href: 'https://laravel.com/docs/starter-kits#react',
            icon: BookOpen,
        },
    ];

    const mainNavItems: NavItem[] = [
        {
            title: t('layout.sidebar.dashboard', 'Dashboard'),
            href: dashboard(),
            icon: LayoutGrid,
        },
        ...(auth.user.role === 'propietario'
            ? [
                  {
                      title: t('layout.sidebar.properties', 'Properties'),
                      href: '/properties',
                      icon: Building2,
                  },
              ]
            : []),
        ...(auth.user.role === 'administrador'
            ? [
                  {
                      title: t('layout.sidebar.amenities', 'Amenities'),
                      href: '/admin/amenities',
                      icon: Settings2,
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
