import { Form, Head } from '@inertiajs/react';
import { FaFacebookF, FaGoogle } from 'react-icons/fa';
import AuthDivider from '@/components/auth/auth-divider';
import AuthSocialButton from '@/components/auth/auth-social-button';
import AuthStatus from '@/components/auth/auth-status';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useTranslations } from '@/hooks/use-translations';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    const { t } = useTranslations();

    const socialProviders = [
        {
            key: 'google',
            label: t('auth.login.google'),
            icon: FaGoogle,
        },
        {
            key: 'facebook',
            label: t('auth.login.facebook'),
            icon: FaFacebookF,
        },
    ] as const;

    return (
        <AuthLayout
            title={t('auth.login.title')}
            description={t('auth.login.description')}
        >
            <Head title={t('auth.login.head_title')} />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="email">
                                    {t('common.email_address')}
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder={t('common.email')}
                                    className="h-11 rounded-xl"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">
                                        {t('common.password')}
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="ml-auto text-sm"
                                            tabIndex={5}
                                        >
                                            {t('auth.login.forgot_password')}
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder={t('common.password')}
                                    className="h-11 rounded-xl"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label htmlFor="remember">
                                    {t('auth.login.remember_me')}
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 h-11 w-full rounded-xl"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                {t('auth.login.submit')}
                            </Button>
                        </div>

                        {canRegister && (
                            <div className="text-center text-sm text-muted-foreground">
                                {t('auth.login.no_account')}{' '}
                                <TextLink href={register()} tabIndex={5}>
                                    {t('auth.login.sign_up')}
                                </TextLink>
                            </div>
                        )}
                    </>
                )}
            </Form>

            <div className="space-y-4">
                <AuthDivider label={t('auth.login.or_continue_with')} />

                <div className="grid gap-2">
                    {socialProviders.map((provider) => (
                        <AuthSocialButton
                            key={provider.key}
                            href={`/auth/${provider.key}/redirect`}
                            label={provider.label}
                            icon={provider.icon}
                        />
                    ))}
                </div>
            </div>

            {status && (
                <AuthStatus className="text-center">{status}</AuthStatus>
            )}
        </AuthLayout>
    );
}
