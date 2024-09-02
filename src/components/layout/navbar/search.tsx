'use client';

import {MagnifyingGlassIcon, CameraIcon} from '@heroicons/react/24/outline';
import {ChangeEvent, FormEvent, useRef, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {createUrl, getErrorMessage, reduceLabelsToFilters} from "@/utils";
import {getImageLabels} from "@/lib/vision";
import {uploadSearchImage} from "@/firebase/client/storage";
import {LoadingButton} from "@/components/ui/loading-button";
import {toast} from "@/components/ui/use-toast";

export default function Search() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState<boolean>(false)

    function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const val = e.target as HTMLFormElement;
        const search = val.search as HTMLInputElement;
        const newParams = new URLSearchParams(searchParams.toString());

        if (search.value) {
            newParams.set('q', search.value);
        } else {
            newParams.delete('q');
        }

        router.push(createUrl('/search', newParams));
    }

    const handleButtonClick = () => {
        // @ts-ignore
        fileInputRef?.current?.click();
    };

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        setLoading(true)
        try {
            const file = event.target.files?.[0] as File
            const url = await uploadSearchImage(file)
            const labels = await getImageLabels(url, 0.5)
            const reducedLabels = reduceLabelsToFilters(labels)
            const newParams = new URLSearchParams(searchParams.toString())
            if (reducedLabels.length > 0) newParams.set('labels', JSON.stringify(reducedLabels))
            else newParams.delete('labels')
            router.push(createUrl('/search', newParams))
        } catch (e) {
            toast({variant: "destructive", title: "Operation failed.", description: getErrorMessage(e)})
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="w-max-[550px] w-full lg:w-80 xl:w-full flex justify-between items-center gap-2">
            <form onSubmit={onSubmit} className="relative w-full">
                <div className="w-max-[550px] relative w-full lg:w-80 xl:w-full">
                    <input
                        key={searchParams?.get('q')}
                        type="text"
                        name="search"
                        placeholder="Search for products..."
                        autoComplete="off"
                        defaultValue={searchParams?.get('q') || ''}
                        className="w-full rounded-lg border bg-white px-4 py-2 text-sm text-black placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
                    />
                    <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
                        <MagnifyingGlassIcon className="h-4"/>
                    </div>
                </div>
            </form>
            <div>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{display: 'none'}}
                    onChange={handleFileChange}
                />
                <LoadingButton variant="outline" size="icon" onClick={handleButtonClick} loading={loading}>
                    <CameraIcon className="w-4 h-4"/>
                </LoadingButton>
            </div>
        </div>
    );
}

export function SearchSkeleton() {
    return (
        <form className="w-max-[550px] relative w-full lg:w-80 xl:w-full">
            <input
                placeholder="Search for products..."
                className="w-full rounded-lg border bg-white px-4 py-2 text-sm text-black placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
            />
            <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
                <MagnifyingGlassIcon className="h-4"/>
            </div>
        </form>
    );
}
