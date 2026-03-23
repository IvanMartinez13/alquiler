import Choices from 'choices.js';
import 'choices.js/public/assets/styles/choices.min.css';
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
} from 'react';

type ChoiceOption = {
    value: string;
    label: string;
    disabled?: boolean;
};

type ChoicesSelectProps = {
    id?: string;
    name: string;
    options: ChoiceOption[];
    defaultValue?: string;
    disabled?: boolean;
    searchEnabled?: boolean;
    searchPlaceholderValue?: string;
    noResultsText?: string;
    noChoicesText?: string;
    className?: string;
};

const ChoicesSelect = forwardRef<HTMLSelectElement, ChoicesSelectProps>(
    (
        {
            id,
            name,
            options,
            defaultValue,
            disabled = false,
            searchEnabled = false,
            searchPlaceholderValue = 'Search...',
            noResultsText = 'No results found',
            noChoicesText = 'No options available',
            className,
        },
        ref,
    ) => {
        const selectRef = useRef<HTMLSelectElement>(null);

        useImperativeHandle(ref, () => selectRef.current as HTMLSelectElement);

        const choicesData = useMemo(
            () =>
                options.map((option) => ({
                    value: option.value,
                    label: option.label,
                    selected: option.value === defaultValue,
                    disabled: option.disabled ?? false,
                })),
            [options, defaultValue],
        );

        useEffect(() => {
            if (!selectRef.current) {
                return;
            }

            const instance = new Choices(selectRef.current, {
                allowHTML: false,
                searchEnabled,
                searchPlaceholderValue,
                noResultsText,
                noChoicesText,
                shouldSort: false,
                itemSelectText: '',
                choices: choicesData,
            });

            instance.containerOuter.element.classList.add('choices-tailwind');

            return () => {
                instance.destroy();
            };
        }, [
            choicesData,
            searchEnabled,
            searchPlaceholderValue,
            noResultsText,
            noChoicesText,
        ]);

        return (
            <select
                ref={selectRef}
                id={id}
                name={name}
                defaultValue={defaultValue}
                disabled={disabled}
                className={className}
            />
        );
    },
);

ChoicesSelect.displayName = 'ChoicesSelect';

export type { ChoiceOption, ChoicesSelectProps };
export default ChoicesSelect;
