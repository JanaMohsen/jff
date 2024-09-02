import {Cart, Option} from "@/lib/shopify/types";
import {
    MAX_DISCOUNT_PERCENTAGE,
    MIN_DESCRIPTION_LENGTH,
    MIN_HANDLE_LENGTH,
    MIN_NAME_LENGTH,
    MIN_PRICE,
    MIN_QUANTITY,
    MIN_TITLE_LENGTH, PHONE_NUMBER_REGEX, ROLES
} from "@/constants";
import {cartItemCount} from "@/utils/index";

export const validateUid = (uid: string) => {
    if (!uid) throw new Error('User id is missing.')
}

export const validateDisplayName = (name: any) => {
    if (name.length < MIN_NAME_LENGTH) throw new Error(`Name must be at least ${MIN_NAME_LENGTH} characters long.`);
}

export const validatePhoneNumber = (phoneNumber: any) => {
    if (typeof phoneNumber !== 'string' || !PHONE_NUMBER_REGEX.test(phoneNumber)) throw new Error("Invalid phone number format.");
}

export const validateRole = (role: any) => {
    if (typeof role !== 'string' || !ROLES.includes(role)) throw new Error(`Role is invalid. It must be one of the following: ${ROLES.toString()}.`);
}

export const validateTitle = (title: any) => {
    if (typeof title !== 'string' || title.length < MIN_TITLE_LENGTH)
        throw new Error(`Title must be at least ${MIN_TITLE_LENGTH} characters long.`);
}

export const validateDescription = (description: any) => {
    if (typeof description !== 'string' || description.length < MIN_DESCRIPTION_LENGTH)
        throw new Error(`Description must be at least ${MIN_DESCRIPTION_LENGTH} characters long.`);
}

export const validateHandle = (handle: any) => {
    if (typeof handle !== 'string' || handle.length < 1)
        throw new Error(`Handle must be at least ${MIN_HANDLE_LENGTH} characters long.`);
}

export const validateOptions = (options: Option[]) => {
    if (options.length === 0) throw new Error("There must be at least one option.")
    const names = options.map(option => option.name);
    const uniqueNames = new Set(names);
    if (names.length !== uniqueNames.size)
        throw new Error("There are duplicate option names.")
    for (const option of options) {
        if (option.name.length === 0)
            throw new Error(`Option name must not be empty.`)
        if (option.values.length === 0)
            throw new Error(`"${option.name}" option must have at least one value.`)
        const uniqueValues = new Set(option.values);
        if (option.values.length !== uniqueValues.size)
            throw new Error("Option values must be unique.")
    }
};

export const validateImages = (images: string[]) => {
    if (images.length === 0) throw new Error("There must be at least one image uploaded.")
}

export const validatePrice = (price: number) => {
    if (price < MIN_PRICE) throw new Error(`Price should be higher than ${MIN_PRICE}.`)
}

export const validateQuantity = (quantity: number) => {
    if (quantity < MIN_QUANTITY) throw new Error(`Quantity should be higher than ${MIN_QUANTITY}.`)
}

export const validateAddress = (address: string) => {
    if (address.length == 0) throw new Error(`Address is required.`);
}

export const validateDiscount = (discount: number) => {
    if (isNaN(discount) || discount > MAX_DISCOUNT_PERCENTAGE) throw new Error(`Discount should be lower than ${MAX_DISCOUNT_PERCENTAGE}%.`)
}

export const validateShippingCost = (shippingCost: number) => {
    if (isNaN(shippingCost)) throw new Error(`You must select an address from the dropdown to evaluate the shipping cost.`)
}

export const validateCart = (cart: Cart) => {
    if (cartItemCount(cart) === 0) throw new Error(`The cart doesn't contain any items.`)
}