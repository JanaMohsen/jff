"use server"

import vision from "@google-cloud/vision"
import {ClientOptions} from "google-gax"
import {google} from "@google-cloud/vision/build/protos/protos";
import IEntityAnnotation = google.cloud.vision.v1.IEntityAnnotation;
import {VisionParsedLabel} from "@/lib/shopify/types";

const credentials = {
    type: process.env.FIREBASE_ADMIN_TYPE,
    project_id: process.env.FIREBASE_ADMIN_PROJECT_ID,
    private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
    client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
    auth_uri: process.env.FIREBASE_ADMIN_AUTH_URI,
    token_uri: process.env.FIREBASE_ADMIN_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_ADMIN_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_ADMIN_UNIVERSAL_DOMAIN
} as ClientOptions

type LabeledOption = Omit<IEntityAnnotation, "description" | "score"> & VisionParsedLabel

const hasValidScoreAndDescription = (label: IEntityAnnotation): label is LabeledOption => {
    return (
        !!label.score &&
        !!label.description &&
        label.score > 0
    );
}

export const getImageLabels = async (imageUrl: string, scoreLimit: number): Promise<VisionParsedLabel[]> => {
    const client = new vision.ImageAnnotatorClient({credentials: credentials});
    const [result] = await client.labelDetection(imageUrl);
    return (result.labelAnnotations || [])
        .filter(hasValidScoreAndDescription)
        .filter((label: LabeledOption) => label.score > scoreLimit)
        .map((label: LabeledOption) => ({
            description: label.description,
            score: label.score
        }))
}