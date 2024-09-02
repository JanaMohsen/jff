"use client"

import {searchClient} from "@/lib/algolia/client";
import {Configure, InstantSearch, useHits, useSearchBox, useSortBy} from "react-instantsearch";
import {useEffect} from "react";
import Grid from "@/components/grid";
import ProductGridItems from "@/components/layout/product-grid-items";
import {AlgoliaProduct, AlgoliaProductHit} from "@/lib/shopify/types";
import {sorting} from "@/lib/constants";

function CustomSearchBox({q}: { q: string | undefined }) {
    const {refine} = useSearchBox()
    useEffect(() => {
        refine(q || "")
    }, [q, refine]);
    return null
}

function CustomHits({q}: { q: string | undefined }) {
    const {hits} = useHits<AlgoliaProduct>()
    const resultsText = hits.length > 1 ? 'results' : 'result'

    return (
        <>
            {q && <p className="mb-4">
                {hits.length === 0
                    ? 'There are no products that match '
                    : `Showing ${hits.length} ${resultsText} for `}
                <span className="font-bold">&quot;{q}&quot;</span>
            </p>}
            {hits.length > 0 ? (
                <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    <ProductGridItems products={hits as AlgoliaProductHit[]}/>
                </Grid>
            ) : null}
        </>
    )
}

function CustomSortBy({currentIndex}: { currentIndex: string }) {
    const {refine} = useSortBy({
        items: sorting.map(sorting => {
            return {label: sorting.title, value: sorting.index}
        })
    })
    useEffect(() => refine(currentIndex), [currentIndex, refine]);
    return null
}

const SearchResults = ({q = undefined, filters = [], sortByIndex, labels = undefined}: {
    q?: string,
    filters?: string[],
    sortByIndex: string,
    labels?: string[]
}) => {
    return (
        <InstantSearch
            // @ts-ignore
            searchClient={searchClient}
            indexName={process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_INDEX}
            insights>
            <CustomSearchBox q={q}/>
            <CustomSortBy currentIndex={sortByIndex}/>
            <Configure filters={filters.join(' AND ')} optionalFilters={labels || []}/>
            <CustomHits q={q}/>
        </InstantSearch>
    )
}

export default SearchResults