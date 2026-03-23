import type { Auth } from '@/types/auth';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            locale: string;
            supported_locales: string[];
            translations: Record<string, unknown>;
            sidebarOpen: boolean;
            [key: string]: unknown;
        };
    }
}
