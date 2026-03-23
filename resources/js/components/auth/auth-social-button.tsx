import type { IconType } from 'react-icons';
import { Button } from '@/components/ui/button';

type Props = {
    href: string;
    label: string;
    icon: IconType;
};

export default function AuthSocialButton({ href, label, icon: Icon }: Props) {
    return (
        <Button variant="outline" asChild className="h-11 w-full justify-start gap-3 rounded-xl border-border/70 bg-background/70 px-4 text-sm backdrop-blur hover:bg-accent/70">
            <a href={href}>
                <span className="inline-flex size-6 items-center justify-center rounded-md bg-muted/80 text-foreground">
                    <Icon className="size-3.5" aria-hidden="true" />
                </span>
                <span>{label}</span>
            </a>
        </Button>
    );
}
