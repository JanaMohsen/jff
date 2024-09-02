'use client';

import clsx from 'clsx';
import {useCart} from "@/hooks";
import {MinusIcon, PlusIcon} from '@heroicons/react/24/outline';
import type {CartItem} from '@/lib/shopify/types';

export function EditItemQuantityButton({item, type}: { item: CartItem; type: 'plus' | 'minus' }) {
    const {incrementItem, decrementItem} = useCart()

    return (
        <button
            onClick={() => {
                if (type === "plus") incrementItem(item.product.id, item.product.variant.id)
                else decrementItem(item.product.id, item.product.variant.id)
            }}
            className={clsx(
                'ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full px-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80',
                {'ml-auto': type === 'minus'})}
        >
            {type === 'plus' ? (
                <PlusIcon className="h-4 w-4 dark:text-neutral-500"/>
            ) : (
                <MinusIcon className="h-4 w-4 dark:text-neutral-500"/>
            )}
        </button>
    );
}