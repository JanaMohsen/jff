import {Collection} from "@/lib/shopify/types";

export const SITE_NAME = "Jana's Fashion Finds"
export const allCategory: Collection = {
    id: "",
    handle: '',
    title: 'All',
    description: 'All products',
    path: '/search'
}
export const CART_LOCAL_STORAGE = 'cart'
export const PHONE_NUMBER_REGEX = /^\+961\d{8}$/
export const ROLES = ["admin", "manager", "assistant"];
export const MIN_NAME_LENGTH = 3;
export const INTERNAL_ERROR = "Internal error."
export const MIN_TITLE_LENGTH = 3;
export const MIN_DESCRIPTION_LENGTH = 15;
export const MIN_HANDLE_LENGTH = 3;
export const CURRENT_PATH_HEADER = "x-current-path";
export const PRODUCT_IMAGES_PATH = 'product-images';
export const SEARCH_IMAGES_PATH = 'search-images';
export const MIN_PRICE = 1;
export const MIN_QUANTITY = 0;
export const TAX_RATE = 0;
export const WAREHOUSE_GEO = [34.122342, 35.652215];
export const SHIPPING_BASE_COST = 5;
export const SHIPPING_COST_PER_KM = 2;
export const MAX_DISCOUNT_PERCENTAGE = 30;
export const EARTH_RADIUS_IN_KM = 6371;