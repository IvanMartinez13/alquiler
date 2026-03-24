import Choices from 'choices.js';
import 'choices.js/public/assets/styles/choices.min.css';
import {
    type ChangeEventHandler,
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
    customProperties?: Record<string, unknown>;
};

type ChoicesSelectProps = {
    id?: string;
    name: string;
    options: ChoiceOption[];
    defaultValue?: string;
    defaultValues?: string[];
    multiple?: boolean;
    disabled?: boolean;
    searchEnabled?: boolean;
    allowHTML?: boolean;
    searchPlaceholderValue?: string;
    noResultsText?: string;
    noChoicesText?: string;
    className?: string;
    onChange?: ChangeEventHandler<HTMLSelectElement>;
};

const ChoicesSelect = forwardRef<HTMLSelectElement, ChoicesSelectProps>(
    (
        {
            id,
            name,
            options,
            defaultValue,
            defaultValues,
            multiple = false,
            disabled = false,
            searchEnabled = false,
            allowHTML = false,
            searchPlaceholderValue = 'Search...',
            noResultsText = 'No results found',
            noChoicesText = 'No options available',
            className,
            onChange,
        },
        ref,
    ) => {
        const selectRef = useRef<HTMLSelectElement>(null);
        const instanceRef = useRef<Choices | null>(null);

        useImperativeHandle(ref, () => selectRef.current as HTMLSelectElement);

        const choicesData = useMemo(
            () =>
                options.map((option) => ({
                    value: option.value,
                    label: option.label,
                    selected: multiple
                        ? (defaultValues ?? []).includes(option.value)
                        : option.value === defaultValue,
                    disabled: option.disabled ?? false,
                    customProperties: option.customProperties,
                })),
            [options, defaultValue, defaultValues, multiple],
        );

        useEffect(() => {
            if (!selectRef.current) {
                return;
            }

            if (instanceRef.current) {
                instanceRef.current.destroy();
                instanceRef.current = null;
            }

            // Ensure there are no stale native options before rebuilding Choices.
            selectRef.current.innerHTML = '';

            const instance = new Choices(selectRef.current, {
                allowHTML,
                searchEnabled,
                searchPlaceholderValue,
                noResultsText,
                noChoicesText,
                shouldSort: false,
                itemSelectText: '',
                removeItemButton: multiple,
                choices: choicesData,
            });

            instance.containerOuter.element.classList.add('choices-tailwind');
            instanceRef.current = instance;

            return () => {
                instance.destroy();

                if (instanceRef.current === instance) {
                    instanceRef.current = null;
                }
            };
        }, [
            choicesData,
            searchEnabled,
            allowHTML,
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
                multiple={multiple}
                disabled={disabled}
                className={className}
                onChange={onChange}
            />
        );
    },
);

ChoicesSelect.displayName = 'ChoicesSelect';

export type { ChoiceOption, ChoicesSelectProps };
export default ChoicesSelect;
