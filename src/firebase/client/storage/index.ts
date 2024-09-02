import {getDownloadURL, ref, uploadBytes} from "@firebase/storage";
import {storage} from "@/firebase/client/config";
import {uuidv4} from "@firebase/util";
import {PRODUCT_IMAGES_PATH, SEARCH_IMAGES_PATH} from "@/constants";
import {getFileExtension} from "@/utils";

export const uploadProductImage = async (file: File) => {
    const filePath = `${PRODUCT_IMAGES_PATH}/${uuidv4()}.${getFileExtension(file)}`
    const storageRef = ref(storage, filePath)
    await uploadBytes(storageRef, file)
    return await getDownloadURL(storageRef);
}

export const uploadSearchImage = async (file: File) => {
    const filePath = `${SEARCH_IMAGES_PATH}/${uuidv4()}.${getFileExtension(file)}`
    const storageRef = ref(storage, filePath)
    await uploadBytes(storageRef, file)
    return await getDownloadURL(storageRef);
}