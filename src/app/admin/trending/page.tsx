"use client"

import {useTrendingItems} from "@algolia/recommend-react";
import {AlgoliaProductWithScore} from "@/lib/shopify/types";
import {recommendClient} from "@/lib/algolia/client";
import Grid from "@/components/grid";
import Link from "next/link";
import {GridTileImage} from "@/components/grid/tile";
import {Skeleton} from "@/components/ui/skeleton";

const Trending = () => {
    const {status, recommendations} = useTrendingItems<AlgoliaProductWithScore>({
        recommendClient: recommendClient,
        indexName: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_INDEX as string,
    });

    if (status === "loading") {
        return <Grid className="grid-cols-1 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({length: 5}).map((_, index) => (
                <Grid.Item key={index} className="animate-pulse">
                    <Skeleton className="aspect-square h-full w-full"/>
                </Grid.Item>
            ))}
        </Grid>
    } else {
        return <Grid className="grid-cols-1 sm:grid-cols-3 lg:grid-cols-5">
            {recommendations.map((product) => (
                <Grid.Item key={product.objectID} className="animate-fadeIn">
                    <Link className="relative inline-block h-full w-full" href={`/product/${product.objectID}`}>
                        <GridTileImage
                            alt={product.title}
                            label={{
                                title: product.title,
                            }}
                            score={product._score}
                            src={product.images[0]}
                            fill
                            sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                        />
                    </Link>
                </Grid.Item>
            ))}
        </Grid>
    }
}

export default Trending