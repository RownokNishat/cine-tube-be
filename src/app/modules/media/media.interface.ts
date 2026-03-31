import { MediaStatus, MediaType, PricingType } from "../../../generated/enums.js";

export interface ICreateMediaPayload {
    title: string;
    synopsis: string;
    releaseYear: number;
    director?: string;
    cast?: string[];
    streamingPlatform?: string[];
    pricingType?: PricingType;
    streamingLink?: string;
    trailerUrl?: string;
    isFeatured?: boolean;
    isEditorPick?: boolean;
    mediaType?: MediaType;
    status?: MediaStatus;
    genreIds?: string[];
}

export interface IUpdateMediaPayload extends Partial<ICreateMediaPayload> {}
