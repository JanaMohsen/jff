'use client';

import clsx from 'clsx';
import {Option, Variant} from '@/lib/shopify/types';
import {createUrl} from '@/utils';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';

type Combination = {
    id: string;
    availableForSale: boolean;
    [key: string]: string | boolean;
};

interface Props {
    options: Option[];
    variants: Variant[];
}

export function VariantSelector({options, variants}: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const hasNoOptionsOrJustOneOption =
        !options.length || (options.length === 1 && options[0]?.values.length === 1);

    if (hasNoOptionsOrJustOneOption) {
        return null;
    }

    const combinations: Combination[] = variants.map((variant) => ({
        id: variant.id,
        availableForSale: variant.availableForSale,
        ...variant.selectedOptions.reduce(
            (accumulator, option) => ({...accumulator, [option.name.toLowerCase()]: option.value}),
            {}
        )
    }));

    return options.map((option, index) => (
        <dl className="mb-8" key={index}>
            <dt className="mb-4 text-sm uppercase tracking-wide">{option.name}</dt>
            <dd className="flex flex-wrap gap-3">
                {option.values.map((value) => {
                    const optionNameLowerCase = option.name.toLowerCase();
                    const optionSearchParams = new URLSearchParams(searchParams.toString());
                    optionSearchParams.set(optionNameLowerCase, value);
                    const optionUrl = createUrl(pathname, optionSearchParams);

                    const filtered = Array.from(optionSearchParams.entries()).filter(([key, value]) =>
                        options.find(
                            (option) => option.name.toLowerCase() === key && option.values.includes(value)
                        )
                    );
                    const isAvailableForSale = combinations.find((combination) =>
                        filtered.every(
                            ([key, value]) => combination[key] === value && combination.availableForSale
                        )
                    );

                    const isActive = searchParams.get(optionNameLowerCase) === value;

                    return (
                        <button
                            key={value}
                            aria-disabled={!isAvailableForSale}
                            disabled={!isAvailableForSale}
                            onClick={() => {
                                router.replace(optionUrl, {scroll: false});
                            }}
                            title={`${option.name} ${value}${!isAvailableForSale ? ' (Out of Stock)' : ''}`}
                            className={clsx(
                                'flex min-w-[48px] items-center justify-center rounded-full border bg-neutral-100 px-2 py-1 text-sm dark:border-neutral-800 dark:bg-neutral-900',
                                {
                                    'cursor-default ring-2 ring-black': isActive,
                                    'ring-1 ring-transparent transition duration-300 ease-in-out hover:scale-110 hover:ring-black ':
                                        !isActive && isAvailableForSale,
                                    'relative z-10 cursor-not-allowed overflow-hidden bg-neutral-100 text-neutral-500 ring-1 ring-neutral-300 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-300 before:transition-transform dark:bg-neutral-900 dark:text-neutral-400 dark:ring-neutral-700 before:dark:bg-neutral-700':
                                        !isAvailableForSale
                                }
                            )}
                        >
                            {value}
                        </button>
                    );
                })}

                <button
                    onClick={() => {
                        const optionSearchParams = new URLSearchParams(searchParams.toString());
                        optionSearchParams.delete(option.name.toLowerCase()); // Clear the selected option
                        const optionUrl = createUrl(pathname, optionSearchParams);
                        router.replace(optionUrl, {scroll: false});
                    }}
                    className="flex min-w-[48px] items-center justify-center rounded-full border bg-neutral-100 px-2 py-1 text-sm dark:border-neutral-800 dark:bg-neutral-900 text-red-600"
                >
                    Reset
                </button>
            </dd>
        </dl>
    ));
}
