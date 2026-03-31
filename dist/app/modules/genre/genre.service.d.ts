export declare const GenreService: {
    getAllGenres: () => Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createGenre: (name: string) => Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteGenre: (id: string) => Promise<void>;
};
//# sourceMappingURL=genre.service.d.ts.map