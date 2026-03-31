export declare const WatchlistService: {
    addToWatchlist: (userId: string, mediaId: string) => Promise<{
        media: {
            genres: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
            }[];
            status: import("../../../generated/enums.js").MediaStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            synopsis: string;
            releaseYear: number;
            director: string;
            cast: string[];
            streamingPlatform: string[];
            pricingType: import("../../../generated/enums.js").PricingType;
            price: number | null;
            streamingLink: string | null;
            posterUrl: string | null;
            trailerUrl: string | null;
            isFeatured: boolean;
            isEditorPick: boolean;
            mediaType: import("../../../generated/enums.js").MediaType;
        };
        id: string;
        createdAt: Date;
        userId: string;
        mediaId: string;
    }>;
    removeFromWatchlist: (userId: string, idParam: string) => Promise<void>;
    getMyWatchlist: (userId: string) => Promise<{
        id: string;
        addedAt: Date;
        media: {
            genres: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
            }[];
            status: import("../../../generated/enums.js").MediaStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            synopsis: string;
            releaseYear: number;
            director: string;
            cast: string[];
            streamingPlatform: string[];
            pricingType: import("../../../generated/enums.js").PricingType;
            price: number | null;
            streamingLink: string | null;
            posterUrl: string | null;
            trailerUrl: string | null;
            isFeatured: boolean;
            isEditorPick: boolean;
            mediaType: import("../../../generated/enums.js").MediaType;
        };
    }[]>;
    checkWatchlistStatus: (userId: string, mediaId: string) => Promise<{
        inWatchlist: boolean;
    }>;
    clearWatchlist: (userId: string) => Promise<void>;
};
//# sourceMappingURL=watchlist.service.d.ts.map