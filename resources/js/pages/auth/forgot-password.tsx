// Components
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import AuthDivider from '@/components/auth/auth-divider';
import AuthStatus from '@/components/auth/auth-status';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/hooks/use-translations';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    const { t } = useTranslations();

    return (
        <AuthLayout
            title={t('auth.forgot_password.title')}
            description={t('auth.forgot_password.description')}
        >
            <Head title={t('auth.forgot_password.head_title')} />

            {status && (
                <AuthStatus className="mb-2 text-center">{status}</AuthStatus>
            )}

            <div className="space-y-5">
                <Form {...email.form()}>
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="email">
                                    {t('common.email_address')}
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="off"
                                    autoFocus
                                    placeholder={t('common.email')}
                                    className="h-11 rounded-xl"
                                />

                                <InputError message={errors.email} />
                            </div>

                            <div className="my-5 flex items-center justify-start">
                                <Button
                                    className="h-11 w-full rounded-xl"
                                    disabled={processing}
                                    data-test="email-password-reset-link-button"
                                >
                                    {processing && (
                                        <LoaderCircle className="h-4 w-4 animate-spin" />
                                    )}
                                    {t('auth.forgot_password.submit')}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

                <AuthDivider label={t('auth.forgot_password.navigation')} />

                <div className="space-x-1 text-center text-sm text-muted-foreground">
                    <span>{t('auth.forgot_password.return_to')}</span>
                    <TextLink href={login()}>
                        {t('auth.forgot_password.log_in')}
                    </TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
