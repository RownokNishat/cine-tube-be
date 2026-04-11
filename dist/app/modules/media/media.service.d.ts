import { MediaStatus, MediaType, PricingType } from "../../../generated/enums.js";
import { IQueryParams } from "../../interfaces/query.interface.js";
import { ICreateMediaPayload, IUpdateMediaPayload } from "./media.interface.js";
export declare const MediaService: {
    getAllMedia: (queryParams: IQueryParams) => Promise<{
        data: {
            genres: {
                id: string;
                name: string;
            }[];
            averageRating: number;
            watchlistCount: number;
            purchaseCount: number;
            _count: {
                reviews: number;
                likes: number;
            };
            status: MediaStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            synopsis: string;
            releaseYear: number;
            director: string;
            cast: string[];
            streamingPlatform: string[];
            pricingType: PricingType;
            price: number | null;
            streamingLink: string | null;
            posterUrl: string | null;
            trailerUrl: string | null;
            isFeatured: boolean;
            isEditorPick: boolean;
            mediaType: MediaType;
            reviews: {
                rating: number;
                _count: {
                    likes: number;
                };
            }[];
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getMediaById: (id: string) => Promise<{
        genres: {
            id: string;
            name: string;
        }[];
        averageRating: number;
        watchlistCount: number;
        purchaseCount: number;
        _count: {
            reviews: number;
            likes: number;
        };
        status: MediaStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        synopsis: string;
        releaseYear: number;
        director: string;
        cast: string[];
        streamingPlatform: string[];
        pricingType: PricingType;
        price: number | null;
        streamingLink: string | null;
        posterUrl: string | null;
        trailerUrl: string | null;
        isFeatured: boolean;
        isEditorPick: boolean;
        mediaType: MediaType;
        reviews: {
            rating: number;
            _count: {
                likes: number;
            };
        }[];
    }>;
    createMedia: (payload: ICreateMediaPayload, posterFile?: Express.Multer.File) => Promise<{
        genres: {
            id: string;
            name: string;
        }[];
        averageRating: number;
        watchlistCount: number;
        purchaseCount: number;
        _count: {
            reviews: number;
            likes: number;
        };
        status: MediaStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        synopsis: string;
        releaseYear: number;
        director: string;
        cast: string[];
        streamingPlatform: string[];
        pricingType: PricingType;
        price: number | null;
        streamingLink: string | null;
        posterUrl: string | null;
        trailerUrl: string | null;
        isFeatured: boolean;
        isEditorPick: boolean;
        mediaType: MediaType;
        reviews: {
            rating: number;
            _count: {
                likes: number;
            };
        }[];
    }>;
    updateMedia: (id: string, payload: IUpdateMediaPayload, posterFile?: Express.Multer.File) => Promise<{
        genres: {
            id: string;
            name: string;
        }[];
        averageRating: number;
        watchlistCount: number;
        purchaseCount: number;
        _count: {
            reviews: number;
            likes: number;
        };
        status: MediaStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        synopsis: string;
        releaseYear: number;
        director: string;
        cast: string[];
        streamingPlatform: string[];
        pricingType: PricingType;
        price: number | null;
        streamingLink: string | null;
        posterUrl: string | null;
        trailerUrl: string | null;
        isFeatured: boolean;
        isEditorPick: boolean;
        mediaType: MediaType;
        reviews: {
            rating: number;
            _count: {
                likes: number;
            };
        }[];
    }>;
    deleteMedia: (id: string) => Promise<void>;
    checkAccess: (userId: string, mediaId: string) => Promise<{
        hasAccess: boolean;
        reason: string;
    }>;
};
//# sourceMappingURL=media.service.d.ts.map