import {FormEvent, useState} from "react";
import {DialogFooter} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {usePathname} from "next/navigation";
import {capitalize, getErrorMessage, parseSwitchValue} from "@/utils";
import {Product} from "@/lib/shopify/types";
import {Switch} from "@/components/ui/switch";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {addVariant} from "@/firebase/admin/firestore/products";
import {MIN_QUANTITY} from "@/constants";
import {LoadingButton} from "@/components/ui/loading-button";

interface Props {
    product: Product
    setModalOpen: (value: (((prevState: boolean) => boolean) | boolean)) => void
}

const AddVariantForm = ({product, setModalOpen}: Props) => {
    const pathname = usePathname()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string>("");

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        try {
            const formData = new FormData(e.currentTarget)
            await addVariant(product.id,
                parseInt(formData.get("quantity") as string),
                parseSwitchValue(formData.get("availableForSale") as string),
                product.options.map(option => ({
                        name: option.name,
                        value: formData.get(option.name) as string
                    })
                ),
                pathname
            )
            setModalOpen(false)
        } catch (e) {
            setError(getErrorMessage(e))
        } finally {
            setLoading(false)
        }
    }

    return <form onSubmit={onSubmit} className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
                id="quantity"
                name="quantity"
                type="number"
                required
                min={MIN_QUANTITY}
                className="col-span-3"
            />
        </div>
        {product.options.map((option, index) => {
            return <div key={index} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={option.name}>{capitalize(option.name)}</Label>
                <Select name={option.name} required>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a value"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {option.values.map(value => {
                                return <SelectItem key={value} value={value}>{value}</SelectItem>
                            })}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        })}
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="availableForSale">Available for sale</Label>
            <Switch id="availableForSale" name="availableForSale"/>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <DialogFooter>
            <LoadingButton type="submit" loading={loading}>
                Save changes
            </LoadingButton>
        </DialogFooter>
    </form>
}

export default AddVariantForm