import {FormEvent, useState} from "react";
import {DialogFooter} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {UserRecord} from "firebase-admin/auth";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {editStaffMember} from "@/firebase/admin/auth";
import {usePathname} from "next/navigation";
import {ROLES} from "@/constants";
import {capitalize, formObject, getErrorMessage} from "@/utils";
import {LoadingButton} from "@/components/ui/loading-button";

interface Props {
    user: UserRecord,
    setModalOpen: (value: (((prevState: boolean) => boolean) | boolean)) => void
}

const EditStaffForm = ({user, setModalOpen}: Props) => {
    const pathname = usePathname()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string>("");

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        try {
            const {displayName, phoneNumber, role} = formObject(e)
            await editStaffMember(user.uid, displayName as string, phoneNumber as string, role as string, pathname)
            setModalOpen(false)
        } catch (e) {
            setError(getErrorMessage(e))
        } finally {
            setLoading(false)
        }
    }

    return <form onSubmit={onSubmit} className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="displayName">Name</Label>
            <Input
                id="displayName"
                name="displayName"
                defaultValue={user.displayName}
                className="col-span-3"
            />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
                id="phoneNumber"
                name="phoneNumber"
                defaultValue={user.phoneNumber}
                className="col-span-3"
                type="tel"
            />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
            <Label>Role</Label>
            <Select name="role" defaultValue={user.customClaims?.role}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a role"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {ROLES.map(role => {
                            return <SelectItem key={role} value={role}>{capitalize(role)}</SelectItem>
                        })}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <DialogFooter>
            <LoadingButton type="submit" loading={loading}>Save changes</LoadingButton>
        </DialogFooter>
    </form>
}

export default EditStaffForm