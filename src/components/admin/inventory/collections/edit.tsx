import {FormEvent, useState} from "react";
import {DialogFooter} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {usePathname} from "next/navigation";
import {Collection} from "@/lib/shopify/types";
import {Textarea} from "@/components/ui/textarea";
import {editCollection} from "@/firebase/admin/firestore/collections";
import {formObject, getErrorMessage} from "@/utils";
import {LoadingButton} from "@/components/ui/loading-button";

interface Props {
    collection: Collection,
    setModalOpen: (value: (((prevState: boolean) => boolean) | boolean)) => void
}

const EditCollectionForm = ({collection, setModalOpen}: Props) => {
    const pathname = usePathname()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string>("");

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        try {
            const {title, description, handle} = formObject(e)
            await editCollection(collection.id, title as string, description as string, handle as string, pathname)
            setModalOpen(false)
        } catch (e) {
            setError(getErrorMessage(e))
        } finally {
            setLoading(false)
        }
    }

    return <form onSubmit={onSubmit} className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title">Title</Label>
            <Input
                id="title"
                name="title"
                defaultValue={collection.title}
                className="col-span-3"
            />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description">Description</Label>
            <Textarea
                id="description"
                name="description"
                defaultValue={collection.description}
                className="col-span-3"
            />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="handle">Handle</Label>
            <Input
                id="handle"
                name="handle"
                defaultValue={collection.handle}
                className="col-span-3"
            />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <DialogFooter>
            <LoadingButton type="submit" loading={loading}>Save changes</LoadingButton>
        </DialogFooter>
    </form>
}

export default EditCollectionForm