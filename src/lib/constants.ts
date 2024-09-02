import {SortFilterItemType} from "@/lib/shopify/types";

export const defaultSort: SortFilterItemType = {
    title: 'Relevance',
    slug: null,
    index: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_INDEX as string
};
export const sorting: SortFilterItemType[] = [
    defaultSort,
    {
        title: 'Price: Low to high',
        slug: 'price-asc',
        index: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_INDEX_PRICE_ASC as string
    },
    {
        title: 'Price: High to low',
        slug: 'price-desc',
        index: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_INDEX_PRICE_DESC as string
    }
];
export const SHOPIFY_GRAPHQL_API_ENDPOINT = '/api/2023-01/graphql.json';
