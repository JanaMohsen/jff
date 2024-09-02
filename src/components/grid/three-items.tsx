"use client"

import {GridTileImage} from '@/components/grid/tile';
import type {AlgoliaProduct} from '@/lib/shopify/types';
import Link from 'next/link';
import {recommendClient} from "@/lib/algolia/client";
import {useTrendingItems} from "@algolia/recommend-react";
import {Skeleton} from "@/components/ui/skeleton";
import {AlgoliaProductWithScore} from "@/lib/shopify/types";

interface Props {
    item?: AlgoliaProduct;
    size: 'full' | 'half';
    priority?: boolean;
    isLoading?: boolean;
}

function ThreeItemGridItem({item, size, priority, isLoading}: Props) {
    if (isLoading) {
        return (
            <div className={size === 'full' ? 'md:col-span-4 md:row-span-2' : 'md:col-span-2 md:row-span-1'}>
                <Skeleton className="aspect-square h-full w-full"/>
            </div>
        );
    } else if (!item) return null

    return (
        <div className={size === 'full' ? 'md:col-span-4 md:row-span-2' : 'md:col-span-2 md:row-span-1'}>
            <Link className="relative block aspect-square h-full w-full" href={`/product/${item!.objectID}`}>
                <GridTileImage
                    src={item!.images[0]}
                    fill
                    sizes={size === 'full' ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 768px) 33vw, 100vw'}
                    priority={priority}
                    alt={item!.title}
                    label={{
                        position: size === 'full' ? 'center' : 'bottom',
                        title: item!.title as string,
                        amount: item!.price
                    }}
                />
            </Link>
        </div>
    );
}

export function ThreeItemGrid() {
    const {status, recommendations} = useTrendingItems<AlgoliaProductWithScore>({
        recommendClient: recommendClient,
        indexName: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_INDEX as string,
        maxRecommendations: 3
    });

    if (status === "loading") {
        return (
            <section className="mx-auto grid max-w-screen-2xl gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2">
                <ThreeItemGridItem size="full" priority={true} isLoading={true}/>
                <ThreeItemGridItem size="half" priority={true} isLoading={true}/>
                <ThreeItemGridItem size="half" isLoading={true}/>
            </section>
        );
    } else {
        return (
            <section className="mx-auto grid max-w-screen-2xl gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2">
                <ThreeItemGridItem size="full" item={recommendations[0]} priority={true}/>
                <ThreeItemGridItem size="half" item={recommendations[1]} priority={true}/>
                <ThreeItemGridItem size="half" item={recommendations[2]}/>
            </section>
        );
    }
}