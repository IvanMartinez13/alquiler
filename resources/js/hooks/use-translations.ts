import { usePage } from '@inertiajs/react';

type TranslationTree = Record<string, unknown>;

const getNestedValue = (tree: TranslationTree, key: string): unknown => {
    return key.split('.').reduce<unknown>((accumulator, segment) => {
        if (
            accumulator &&
            typeof accumulator === 'object' &&
            segment in (accumulator as Record<string, unknown>)
        ) {
            return (accumulator as Record<string, unknown>)[segment];
        }

        return undefined;
    }, tree);
};

export const useTranslations = () => {
    const { translations } = usePage().props as {
        translations?: TranslationTree;
    };

    const dictionary = translations ?? {};

    const t = (key: string, fallback?: string): string => {
        const value = getNestedValue(dictionary, key);

        if (typeof value === 'string') {
            return value;
        }

        return fallback ?? key;
    };

    return {
        t,
    };
};
