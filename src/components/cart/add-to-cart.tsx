'use client';

import React from "react";
import {Product, Variant} from '@/lib/shopify/types';
import {useSearchParams} from 'next/navigation';
import {useToast} from "@/components/ui/use-toast";
import {useCart} from "@/hooks";
import {Button} from "@/components/ui/button";

interface Props {
    product: Product;
}

export function AddToCart({product}: Props) {
    const {toast} = useToast()
    const {addItem} = useCart()
    const searchParams = useSearchParams();
    const variant = product.variants.find((variant: Variant) =>
        variant.selectedOptions.every(
            (option) => option.value === searchParams.get(option.name.toLowerCase())
        )
    );
    const outOfStock = variant && (!variant.availableForSale || variant.quantity === 0);

    async function onClick() {
        if (!variant?.id) showToast("Please select a variant.")
        else addItem(product, variant.id, 1)
    }

    function showToast(message: string) {
        toast({variant: "destructive", title: "Operation failed.", description: message})
    }

    return (
        <Button
            onClick={onClick}
            className="w-full"
            disabled={!variant?.id || outOfStock}
        >
            {outOfStock ? "Out Of Stock" : "Add To Cart"}
        </Button>
    );
}