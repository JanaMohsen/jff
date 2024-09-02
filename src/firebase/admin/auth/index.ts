"use server"

import {admin} from "@/firebase/admin/config";
import {UserRecord} from "firebase-admin/auth";
import {ROLES} from "@/constants";
import {revalidatePath} from "next/cache";
import {validateDisplayName, validatePhoneNumber, validateRole, validateUid} from "@/utils/validation";

export async function getStaff(): Promise<UserRecord[]> {
    const auth = admin.auth()
    const listUsersResult = await auth.listUsers();
    const staff: UserRecord[] = [];

    for (const user of listUsersResult.users)
        if (ROLES.includes(user.customClaims?.role))
            staff.push(user)

    return JSON.parse(JSON.stringify(staff))
}

export async function addStaffMember(name: string, email: string, phoneNumber: string, password: string, role: string, path: string) {
    validateDisplayName(name)
    validatePhoneNumber(phoneNumber)
    validateRole(role)

    const auth = admin.auth()
    const userRecord = await auth.createUser({displayName: name, email, phoneNumber, password})
    await auth.setCustomUserClaims(userRecord.uid, {role})

    revalidatePath(path)
}

export async function editStaffMember(uid: string, name: string, phoneNumber: string, role: string, path: string) {
    validateUid(uid)
    validateDisplayName(name)
    validatePhoneNumber(phoneNumber)
    validateRole(role)

    const auth = admin.auth()
    await auth.setCustomUserClaims(uid, {role})
    await auth.updateUser(uid, {displayName: name, phoneNumber})

    revalidatePath(path)
}

export async function deleteStaffMember(uid: string, path: string) {
    const auth = admin.auth()
    await auth.deleteUser(uid)
    revalidatePath(path)
}