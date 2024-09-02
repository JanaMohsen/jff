"use client"

import {useLookingSimilar} from "@algolia/recommend-react";
import type {AlgoliaProduct} from "@/lib/shopify/types";
import {recommendClient} from "@/lib/algolia/client";
import Link from "next/link";
import {GridTileImage} from "@/components/grid/tile";
import {Skeleton} from "@/components/ui/skeleton";

const RelatedProducts = ({id}: { id: string }) => {
    const {status, recommendations} = useLookingSimilar<AlgoliaProduct>({
        recommendClient: recommendClient,
        indexName: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_INDEX as string,
        maxRecommendations: 4,
        objectIDs: [id]
    });

    return (
        <div className="py-8">
            <h2 className="mb-4 text-2xl font-bold">Similar Products</h2>
            <ul className="flex w-full gap-4 overflow-x-auto pt-1">
                {status === "loading" ?
                    <>
                        {Array.from({length: 4}).map((_, index) => (
                            <li key={index}
                                className="aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5">
                                <Skeleton className="aspect-square h-full w-full"/>
                            </li>
                        ))}
                    </> :
                    <>
                        {recommendations.map((product) => (
                            <li key={product.objectID}
                                className="aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5">
                                <Link className="relative h-full w-full" href={`/product/${product.objectID}`}>
                                    <GridTileImage
                                        alt={product.title}
                                        label={{title: product.title, amount: product.price}}
                                        src={product.images[0]}
                                        fill
                                        sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                                    />
                                </Link>
                            </li>
                        ))}
                    </>
                }
            </ul>
        </div>
    )
}

export default RelatedProducts