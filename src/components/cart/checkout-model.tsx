"use client"

import {
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useCart, useUser} from "@/hooks";
import PlacesAutocomplete from "@/components/cart/places-autocomplete";
import React, {FormEvent, useEffect, useState} from "react";
import PlaceResult = google.maps.places.PlaceResult;
import {formatNb, getCartTotal, getErrorMessage, getShippingCost} from "@/utils";
import {defaultPersonalizedDiscount, getPersonalizedDiscount} from "@/firebase/client/vertex-ai";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {BadgeDollarSignIcon} from "lucide-react";
import {useRouter} from "next/navigation";
import {DecodedIdToken} from "firebase-admin/auth";
import {LoadingButton} from "@/components/ui/loading-button";
import {Cart} from "@/lib/shopify/types";
import {addOrder, getUserOrders} from "@/firebase/admin/firestore/orders";

interface Props {
    setModalOpen: (value: (((prevState: boolean) => boolean) | boolean)) => void
    closeCart:  () => void
}

const CheckoutModelContent = ({closeCart, setModalOpen}: Props) => {
    const router = useRouter()
    const {user} = useUser()
    const {cart} = useCart()

    if (!user) {
        router.push("/auth/log-in")
        return null
    } else if (!cart) {
        return <>Loading cart...</>
    } else {
        return <CheckoutForm user={user} cart={cart} setModalOpen={setModalOpen} closeCart={closeCart}/>
    }
}

const CheckoutForm = ({user, cart, setModalOpen, closeCart}: Props & { user: DecodedIdToken, cart: Cart }) => {
    const {emptyCart} = useCart()
    const [place, setPlace] = useState<PlaceResult | null>(null)
    const [shippingCost, setShippingCost] = useState<number>(NaN)
    const [personalizedDiscount, setPersonalizedDiscount] = useState(defaultPersonalizedDiscount)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")

    useEffect(() => {
        (async () => {
            const orders = await getUserOrders()
            setPersonalizedDiscount(await getPersonalizedDiscount(getCartTotal(cart), orders))
        })();
    }, [cart])

    useEffect(() => {
        const lat = place?.geometry?.location?.lat()
        const lng = place?.geometry?.location?.lng()
        if (place) {
            if (!lat || !lng) {
                setError("Seems that this place doesn't have a specific lat/lng. Please select a more specific location.")
                setShippingCost(NaN)
                setPlace(null)
            } else {
                setShippingCost(getShippingCost(lat, lng))
            }
        }
    }, [place])

    const getFinalTotalCost = () => {
        let total = getCartTotal(cart)
        if (personalizedDiscount?.discount) total *= (1 - personalizedDiscount.discount / 100)
        if (!isNaN(shippingCost)) total += shippingCost
        return total
    }

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()
            setError("")
            setLoading(true)
            const formData = new FormData(e.currentTarget)

            await addOrder(
                cart,
                formData.get("phoneNumber") as string,
                formData.get("address") as string,
                personalizedDiscount.discount,
                shippingCost
            )
            setModalOpen(false)
            closeCart()
            emptyCart()
        } catch (e) {
            setError(getErrorMessage(e))
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <DialogHeader>
                <DialogTitle>Checkout form</DialogTitle>
                <DialogDescription>
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    Payment will be accepted upon arrival.
                </DialogDescription>
            </DialogHeader>
            <form className="grid gap-2" onSubmit={onSubmit} onChange={() => setError("")}>
                {!!personalizedDiscount.discount &&
                    <Alert>
                        <BadgeDollarSignIcon className="h-4 w-4"/>
                        <AlertTitle>Discount!</AlertTitle>
                        <AlertDescription>
                            {personalizedDiscount.message}
                        </AlertDescription>
                    </Alert>
                }
                <div>
                    <Label htmlFor="displayName">Name</Label>
                    <Input id="displayName" defaultValue={user.name} readOnly/>
                </div>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user.email} readOnly/>
                </div>
                <div>
                    <Label htmlFor="phoneNumber">Phone number</Label>
                    <Input id="phoneNumber" name="phoneNumber" defaultValue={user.phone_number}/>
                </div>
                <div>
                    <Label htmlFor="address">Address</Label>
                    <PlacesAutocomplete id="address" name="address" setPlace={setPlace}/>
                </div>
                <div className="flex gap-5">
                    <div>
                        <Label htmlFor="totalCost">Total($)</Label>
                        <Input id="totalCost" value={getCartTotal(cart)} readOnly/>
                    </div>
                    <div>
                        <Label htmlFor="shippingCost">Shipping($)</Label>
                        <Input id="shippingCost" value={formatNb(shippingCost)} readOnly/>
                    </div>
                </div>

                {error && <p className="text-red-500">{error}</p>}

                <DialogFooter className="mt-2">
                    <LoadingButton type="submit" loading={loading}>
                        Proceed with ${formatNb(getFinalTotalCost())}</LoadingButton>
                </DialogFooter>
            </form>
        </>
    )
}

export default CheckoutModelContent