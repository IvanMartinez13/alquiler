import { ImagePlus, UploadCloud, X } from 'lucide-react';
import type { ChangeEvent, DragEvent } from 'react';
import { useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ImageDropzoneProps = {
    id: string;
    name: string;
    accept?: string;
    multiple?: boolean;
    className?: string;
    helperText?: string;
    favoriteIndex?: number | null;
    onFavoriteIndexChange?: (index: number | null) => void;
    favoriteLabel?: string;
};

type PreviewFile = {
    key: string;
    url: string;
    fileName: string;
};

export default function ImageDropzone({
    id,
    name,
    accept = 'image/png,image/jpeg,image/webp',
    multiple = true,
    className,
    helperText,
    favoriteIndex = null,
    onFavoriteIndexChange,
    favoriteLabel = 'Favorite',
}: ImageDropzoneProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [previews, setPreviews] = useState<PreviewFile[]>([]);

    const selectedCount = useMemo(() => previews.length, [previews]);

    const syncFiles = (files: FileList | null) => {
        if (!files) {
            setPreviews([]);

            return;
        }

        const nextPreviews = Array.from(files).map((file, index) => ({
            key: `${file.name}-${index}`,
            url: URL.createObjectURL(file),
            fileName: file.name,
        }));

        if (onFavoriteIndexChange) {
            onFavoriteIndexChange(nextPreviews.length > 0 ? 0 : null);
        }

        setPreviews((current) => {
            current.forEach((preview) => URL.revokeObjectURL(preview.url));

            return nextPreviews;
        });
    };

    const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        syncFiles(event.target.files);
    };

    const onDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);

        if (!inputRef.current || !event.dataTransfer.files.length) {
            return;
        }

        const dataTransfer = new DataTransfer();
        Array.from(event.dataTransfer.files).forEach((file) => {
            dataTransfer.items.add(file);
        });

        inputRef.current.files = dataTransfer.files;
        syncFiles(inputRef.current.files);
    };

    const clearFiles = () => {
        if (inputRef.current) {
            inputRef.current.value = '';
        }

        if (onFavoriteIndexChange) {
            onFavoriteIndexChange(null);
        }

        setPreviews((current) => {
            current.forEach((preview) => URL.revokeObjectURL(preview.url));

            return [];
        });
    };

    return (
        <div className={cn('space-y-3', className)}>
            <div
                className={cn(
                    'rounded-xl border-2 border-dashed p-6 transition-colors',
                    isDragging
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-muted/20',
                )}
                onDragEnter={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                }}
                onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={(event) => {
                    event.preventDefault();
                    setIsDragging(false);
                }}
                onDrop={onDrop}
            >
                <input
                    ref={inputRef}
                    id={id}
                    type="file"
                    name={name}
                    accept={accept}
                    multiple={multiple}
                    onChange={onInputChange}
                    className="sr-only"
                />

                <label
                    htmlFor={id}
                    className="flex cursor-pointer flex-col items-center gap-3 text-center"
                >
                    <span className="rounded-full bg-primary/10 p-3 text-primary">
                        <UploadCloud className="size-6" />
                    </span>
                    <div className="space-y-1">
                        <p className="text-sm font-medium">
                            Drag images here or click to upload
                        </p>
                        <p className="text-xs text-muted-foreground">
                            PNG, JPG, WEBP. Max 5MB each.
                        </p>
                    </div>
                </label>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                    {helperText ?? 'Optional field'}
                    {selectedCount > 0 ? ` - ${selectedCount} selected` : ''}
                </span>
                {selectedCount > 0 && (
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={clearFiles}
                    >
                        <X className="mr-2 size-4" />
                        Clear
                    </Button>
                )}
            </div>

            {selectedCount > 0 && (
                <div className="grid gap-3 md:grid-cols-4">
                    {previews.map((preview, index) => (
                        <div
                            key={preview.key}
                            className="space-y-2 rounded-lg border border-border p-2"
                        >
                            <div className="aspect-video overflow-hidden rounded-md bg-muted/30">
                                <img
                                    src={preview.url}
                                    alt={preview.fileName}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <p className="line-clamp-1 text-xs text-muted-foreground">
                                <ImagePlus className="mr-1 inline size-3" />
                                {preview.fileName}
                            </p>
                            {onFavoriteIndexChange && (
                                <Button
                                    type="button"
                                    size="sm"
                                    variant={favoriteIndex === index ? 'default' : 'outline'}
                                    className="w-full"
                                    onClick={() => onFavoriteIndexChange(index)}
                                >
                                    {favoriteLabel}
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
