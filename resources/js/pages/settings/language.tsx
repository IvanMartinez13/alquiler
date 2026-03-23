import { Transition } from '@headlessui/react';
import { Form, Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import ChoicesSelect from '@/components/ui/choices-select';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import type { BreadcrumbItem } from '@/types';
import LanguageController from '@/actions/App/Http/Controllers/Settings/LanguageController';
import { edit } from '@/routes/language';

type LocaleOption = {
    value: string;
    label: string;
};

type Props = {
    currentLocale: string;
    locales: LocaleOption[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Language settings',
        href: edit(),
    },
];

export default function Language({ currentLocale, locales }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Language settings" />

            <h1 className="sr-only">Language settings</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Language"
                        description="Choose the language used by your account"
                    />

                    <Form
                        {...LanguageController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        className="space-y-6"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="locale">Language</Label>
                                    <ChoicesSelect
                                        id="locale"
                                        name="locale"
                                        options={locales}
                                        defaultValue={currentLocale}
                                        disabled={processing}
                                        searchEnabled
                                        searchPlaceholderValue="Buscar idioma..."
                                        noResultsText="No se encontraron resultados"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.locale}
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <Button disabled={processing}>Save</Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-neutral-600">
                                            Saved
                                        </p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
