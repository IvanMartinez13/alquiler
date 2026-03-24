import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

type RichTextEditorProps = {
    id: string;
    name: string;
    defaultValue?: string | null;
    placeholder?: string;
    className?: string;
};

const TOOLBAR_OPTIONS: NonNullable<
    ConstructorParameters<typeof Quill>[1]
>['modules'] = {
    toolbar: [
        [{ header: [2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'blockquote'],
        ['clean'],
    ],
};

const FORMATS = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'link',
    'blockquote',
] as const;

function sanitizeHtml(html: string): string {
    const parser = new DOMParser();
    const document = parser.parseFromString(html, 'text/html');

    document.body.querySelectorAll('*').forEach((element) => {
        element.removeAttribute('class');
        element.removeAttribute('style');

        // Prevent editor/runtime attributes from leaking into saved HTML.
        [...element.attributes]
            .filter((attribute) => attribute.name.startsWith('data-'))
            .forEach((attribute) => element.removeAttribute(attribute.name));
    });

    return document.body.innerHTML.trim();
}

export default function RichTextEditor({
    id,
    name,
    defaultValue,
    placeholder,
    className,
}: RichTextEditorProps) {
    const editorContainerRef = useRef<HTMLDivElement | null>(null);
    const hiddenInputRef = useRef<HTMLInputElement | null>(null);
    const quillRef = useRef<Quill | null>(null);

    useEffect(() => {
        const container = editorContainerRef.current;

        if (!container || quillRef.current) {
            return;
        }

        const quill = new Quill(container, {
            theme: 'snow',
            placeholder,
            modules: TOOLBAR_OPTIONS,
            formats: [...FORMATS],
        });

        // Quill toolbar buttons live inside forms; force button type to avoid unintended submit.
        container
            .querySelectorAll<HTMLButtonElement>('.ql-toolbar button')
            .forEach((button) => {
                button.type = 'button';
            });

        const initialHtml = defaultValue?.trim() ?? '';

        if (initialHtml !== '') {
            quill.clipboard.dangerouslyPasteHTML(sanitizeHtml(initialHtml));
        }

        const syncHiddenInput = () => {
            const input = hiddenInputRef.current;

            if (!input) {
                return;
            }

            const rawHtml = quill.root.innerHTML;
            const plainText = quill.getText().trim();
            input.value = plainText === '' ? '' : sanitizeHtml(rawHtml);
        };

        syncHiddenInput();
        quill.on('text-change', syncHiddenInput);
        quillRef.current = quill;

        return () => {
            quill.off('text-change', syncHiddenInput);
            quillRef.current = null;

            // Quill has no destroy API; reset the mount node to avoid stacked toolbars/editors.
            container.innerHTML = '';
        };
    }, [defaultValue, placeholder]);

    return (
        <div className={cn('grid gap-2', className)}>
            <input ref={hiddenInputRef} id={id} type="hidden" name={name} />
            <div
                className="border border-input bg-background text-foreground
                [&_.ql-container.ql-snow]:border-0
                [&_.ql-editor]:min-h-30
                [&_.ql-editor]:text-sm
                [&_.ql-toolbar.ql-snow]:border-x-0
                [&_.ql-toolbar.ql-snow]:border-t-0"
                ref={editorContainerRef}
            />
        </div>
    );
}
