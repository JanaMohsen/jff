import {DocumentReference} from "@google-cloud/firestore";
import {Hit} from "algoliasearch";

export type Collection = FirebaseCollection & {
    id: string;
    path: string;
};

export type Menu = {
    title: string;
    path: string;
};

export type Page = {
    id: string;
    title: string;
    handle: string;
    body: string;
    bodySummary: string;
    seo?: SEO;
    createdAt: string;
    updatedAt: string;
};

export type Option = {
    name: string;
    values: string[];
};

export type FirebaseVariant = {
    availableForSale: boolean;
    quantity: number;
    selectedOptions: {
        name: string;
        value: string;
    }[];
}

export type Variant = FirebaseVariant & {
    id: string;
};

export type SEO = {
    title: string;
    description: string;
};

export type FirebaseCollection = {
    handle: string;
    title: string;
    description: string;
};

export type FirebaseProduct = {
    title: string;
    description: string;
    price: number;
    category: DocumentReference;
    options: Option[];
    images: string[];
    reviews: Review[];
}

export type Product = Omit<FirebaseProduct, 'category'> & {
    id: string;
    variants: Variant[];
    category: Collection;
};

export type Review = {
    userId: string;
    stars: number;
    text: string;
}

export type ShopifyPageOperation = {
    data: { pageByHandle: Page };
    variables: { handle: string };
};

export type NextSearchParams = { [key: string]: string | string[] | undefined }

export type VisionParsedLabel = { score: number; description: string }

export type AlgoliaProduct = Omit<FirebaseProduct, 'category'> & {
    objectID: string;
    category: string;
    labels?: VisionParsedLabel[];
}

export type AlgoliaProductWithScore = AlgoliaProduct & {
    _score: number
}

export type AlgoliaProductHit = Hit<AlgoliaProduct>

export type SortFilterItemType = {
    title: string;
    slug: string | null;
    index: string;
}

export type CartItemProduct = Pick<Product, 'id' | 'title' | 'description' | 'price' | 'images'> & {
    variant: Variant
}

export type CartItem = {
    product: CartItemProduct;
    quantity: number;
}

export type Cart = {
    items: CartItem[]
}

export type LabeledProduct = Product & {
    labels?: VisionParsedLabel[]
}

export type FirebaseOrder = {
    userId: string;
    phoneNumber: string
    items: {
        productVariant: DocumentReference;
        quantity: number;
        price: number;
    }[]
    discount: number;
    shippingCost: number;
    address: string;
    status: "pending" | "shipped" | "delivered"
}

export type Order = Omit<FirebaseOrder, 'items'> & {
    id: string;
    items: {
        productVariant: string;
        quantity: number;
        price: number;
    }[]
}