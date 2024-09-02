import {ReadonlyURLSearchParams} from 'next/navigation';
import {
    EARTH_RADIUS_IN_KM,
    INTERNAL_ERROR,
    ROLES,
    SHIPPING_BASE_COST,
    SHIPPING_COST_PER_KM,
    TAX_RATE,
    WAREHOUSE_GEO
} from "@/constants";
import {DecodedIdToken} from "firebase-admin/auth";
import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import React from "react";
import {defaultSort, sorting} from "@/lib/constants";
import {Cart, CartItem, SortFilterItemType, Variant, VisionParsedLabel} from "@/lib/shopify/types";

export function getErrorMessage(error: any): string {
    return error?.message || INTERNAL_ERROR
}

export const getSortFilterItem = (slug: string | string[] | undefined): SortFilterItemType => {
    return sorting.find(item => item.slug === slug) || defaultSort
};

export const createUrl = (pathname: string, params: URLSearchParams | ReadonlyURLSearchParams) => {
    const paramsString = params.toString();
    const queryString = `${paramsString.length ? '?' : ''}${paramsString}`;

    return `${pathname}${queryString}`;
};

export const capitalize = (variable: string): string => {
    return variable.charAt(0).toUpperCase() + variable.slice(1);
}

export const isStaff = (user: DecodedIdToken) => {
    return ROLES.includes(user?.role)
}

export const formObject = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    return Object.fromEntries(formData.entries());
}

export const parseSwitchValue = (value: string) => {
    return (value && value.toLowerCase() === "on") || false;
}

export const getFileExtension = (file: File) => {
    const extension = file.name.split('.').pop();
    return file.name.includes('.') ? extension : '';
}

export const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs))
}

export const cartItemCount = (cart: Cart | undefined) => {
    if (!cart) return 0
    return cart.items.reduce((total, item) => total + item.quantity, 0)
}

export const productVariantTitle = (variant: Variant): string => {
    return variant.selectedOptions
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(option => option.value)
        .join(' / ')
};

export const getItemPrice = (item: CartItem) => {
    return item.quantity * item.product.price
}

export const getCartTotal = (cart: Cart) => {
    return cart.items.reduce((total, item) => {
        return total + item.product.price * item.quantity;
    }, 0);
}

export const getShippingCost = (lat: number, lng: number) => {
    const distance = haversineDistance(lat, lng, WAREHOUSE_GEO[0], WAREHOUSE_GEO[1]);
    return SHIPPING_BASE_COST + SHIPPING_COST_PER_KM * distance;
}

const toRadians = (degrees: number) => degrees * (Math.PI / 180);

const haversineDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS_IN_KM * c;
};

export const formatNb = (number: number) => {
    return parseFloat(number.toFixed(2))
}

export const reduceLabelsToFilters = (labels: VisionParsedLabel[]) => {
    return labels.map(label => `labels.description:${label.description}`);
}