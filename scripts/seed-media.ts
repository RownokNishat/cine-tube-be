import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/client.js";
import { MediaStatus, MediaType, PricingType } from "../src/generated/enums.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL is missing in environment variables");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const DEFAULT_GENRES = [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Drama",
    "Fantasy",
    "Horror",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Thriller",
];

const MOVIE_TITLES = [
    "The Shawshank Redemption",
    "The Godfather",
    "The Dark Knight",
    "Pulp Fiction",
    "Fight Club",
    "Forrest Gump",
    "Inception",
    "The Matrix",
    "Interstellar",
    "The Lord of the Rings: The Fellowship of the Ring",
    "The Lord of the Rings: The Two Towers",
    "The Lord of the Rings: The Return of the King",
    "The Empire Strikes Back",
    "Star Wars",
    "The Silence of the Lambs",
    "Se7en",
    "Gladiator",
    "Braveheart",
    "Saving Private Ryan",
    "Schindler's List",
    "The Green Mile",
    "The Prestige",
    "Whiplash",
    "The Departed",
    "Parasite",
    "Joker",
    "Dune",
    "Dune: Part Two",
    "Mad Max: Fury Road",
    "Blade Runner 2049",
    "The Social Network",
    "No Country for Old Men",
    "La La Land",
    "Arrival",
    "The Grand Budapest Hotel",
    "Prisoners",
    "Shutter Island",
    "Gone Girl",
    "The Revenant",
    "Once Upon a Time in Hollywood",
    "The Irishman",
    "Her",
    "Ex Machina",
    "The Wolf of Wall Street",
    "The Hateful Eight",
    "Django Unchained",
    "Inglourious Basterds",
    "Memento",
    "The Curious Case of Benjamin Button",
    "A Beautiful Mind",
    "The Imitation Game",
    "The King's Speech",
    "The Theory of Everything",
    "Black Swan",
    "Birdman",
    "Spotlight",
    "Moonlight",
    "12 Years a Slave",
    "The Shape of Water",
    "Everything Everywhere All at Once",
    "Top Gun: Maverick",
    "Mission: Impossible - Fallout",
    "Mission: Impossible - Dead Reckoning Part One",
    "Skyfall",
    "Casino Royale",
    "John Wick",
    "John Wick: Chapter 2",
    "John Wick: Chapter 3 - Parabellum",
    "John Wick: Chapter 4",
    "Logan",
    "The Batman",
    "Spider-Man: Into the Spider-Verse",
    "Spider-Man: Across the Spider-Verse",
    "Avengers: Infinity War",
    "Avengers: Endgame",
    "Iron Man",
    "Captain America: The Winter Soldier",
    "Guardians of the Galaxy",
    "Doctor Strange",
    "Black Panther",
    "Thor: Ragnarok",
    "The Lion King",
    "Toy Story",
    "Toy Story 3",
    "Coco",
    "Inside Out",
    "Up",
    "WALL-E",
    "Ratatouille",
    "Finding Nemo",
    "Monsters, Inc.",
    "Spirited Away",
    "My Neighbor Totoro",
    "Princess Mononoke",
    "Howl's Moving Castle",
    "The Wind Rises",
    "Your Name",
    "Weathering with You",
    "A Silent Voice",
    "The Pianist",
    "City of God",
    "The Intouchables",
    "Oldboy",
    "Pan's Labyrinth",
    "Amelie",
    "The Truman Show",
    "Catch Me If You Can",
    "Ocean's Eleven",
    "The Big Short",
];

const SERIES_TITLES = [
    "Breaking Bad",
    "Better Call Saul",
    "Game of Thrones",
    "House of the Dragon",
    "The Sopranos",
    "The Wire",
    "Stranger Things",
    "Dark",
    "Sherlock",
    "The Office",
    "Parks and Recreation",
    "Friends",
    "How I Met Your Mother",
    "Seinfeld",
    "Brooklyn Nine-Nine",
    "The Big Bang Theory",
    "Modern Family",
    "Succession",
    "The Crown",
    "The Mandalorian",
    "Andor",
    "Loki",
    "WandaVision",
    "The Last of Us",
    "Westworld",
    "True Detective",
    "Fargo",
    "The Bear",
    "Black Mirror",
    "Peaky Blinders",
    "Vikings",
    "The Witcher",
    "Narcos",
    "Money Heist",
    "Squid Game",
    "Ozark",
    "The Boys",
    "Invincible",
    "Reacher",
    "Jack Ryan",
    "The Haunting of Hill House",
    "Midnight Mass",
    "The Fall of the House of Usher",
    "Mindhunter",
    "The Queen's Gambit",
    "Chernobyl",
    "Band of Brothers",
    "The Pacific",
    "House",
    "Grey's Anatomy",
    "The Good Doctor",
    "The Walking Dead",
    "The 100",
    "Lost",
    "Fringe",
    "Prison Break",
    "Dexter",
    "Dexter: New Blood",
    "Hannibal",
    "Mr. Robot",
    "Silicon Valley",
    "Halt and Catch Fire",
    "The Newsroom",
    "Mad Men",
    "Suits",
    "Billions",
    "The Expanse",
    "Foundation",
    "Silo",
    "Severance",
    "For All Mankind",
    "The Morning Show",
    "Ted Lasso",
    "Shrinking",
    "Only Murders in the Building",
    "The Handmaid's Tale",
    "Euphoria",
    "The White Lotus",
    "Mare of Easttown",
    "Big Little Lies",
    "The Night Of",
    "Bodyguard",
    "Line of Duty",
    "Broadchurch",
    "Doctor Who",
    "The X-Files",
    "Supernatural",
    "The Vampire Diaries",
    "The Originals",
    "Arrow",
    "The Flash",
    "Smallville",
    "Gotham",
    "Lucifer",
    "Wednesday",
    "You",
    "Sex Education",
    "Heartstopper",
    "Alice in Borderland",
    "Kingdom",
    "Arcane",
    "Cyberpunk: Edgerunners",
    "Death Note",
    "Attack on Titan",
    "Demon Slayer",
    "Jujutsu Kaisen",
    "Fullmetal Alchemist: Brotherhood",
    "Steins;Gate",
    "Vinland Saga",
    "Monster",
    "One Piece",
];

const DIRECTORS = [
    "Christopher Nolan",
    "Denis Villeneuve",
    "Greta Gerwig",
    "David Fincher",
    "Martin Scorsese",
    "Bong Joon-ho",
    "Steven Spielberg",
    "Ridley Scott",
    "Patty Jenkins",
    "James Cameron",
    "Quentin Tarantino",
    "Sofia Coppola",
    "Ryan Coogler",
    "Peter Jackson",
    "Alfonso Cuaron",
    "Chloe Zhao",
    "Matt Reeves",
    "Sam Mendes",
    "Damien Chazelle",
    "Guillermo del Toro",
];

const CAST_POOL = [
    "Leonardo DiCaprio",
    "Margot Robbie",
    "Cillian Murphy",
    "Florence Pugh",
    "Timothee Chalamet",
    "Zendaya",
    "Robert Downey Jr.",
    "Scarlett Johansson",
    "Ryan Gosling",
    "Emma Stone",
    "Tom Hardy",
    "Saoirse Ronan",
    "Oscar Isaac",
    "Pedro Pascal",
    "Anya Taylor-Joy",
    "Jodie Comer",
    "John Boyega",
    "Daniel Kaluuya",
    "Paul Mescal",
    "Ayo Edebiri",
    "Jeremy Strong",
    "Sarah Snook",
    "Bella Ramsey",
    "Millie Bobby Brown",
    "Bryan Cranston",
    "Rhea Seehorn",
    "Bob Odenkirk",
    "Henry Cavill",
    "Jenna Ortega",
    "Penn Badgley",
];

const STREAMING_PLATFORMS = [
    "Netflix",
    "Prime Video",
    "Disney+",
    "HBO Max",
    "Hulu",
    "Apple TV+",
    "Paramount+",
    "Peacock",
];

const TRAILER_IDS = [
    "8ugaeA-nMTc",
    "YoHD9XEInc0",
    "TcMBFSGVi1c",
    "EXeTwQWrcwY",
    "Wg86eQkdudI",
    "zSWdZVtXT7E",
    "s7EdQ4FqbhY",
    "vKQi3bBA1y8",
    "Q0CbN8sfihY",
    "xjDjIWPwcPU",
    "6ZfuNTqbHE8",
    "JfVOs4VSpmA",
];

const MOVIE_COUNT = 110;
const SERIES_COUNT = 110;
const SEED_TAG = "[CT_MEDIA_SEED_2026_04_12]";

type SeedRecord = {
    title: string;
    synopsis: string;
    releaseYear: number;
    director: string;
    cast: string[];
    streamingPlatform: string[];
    pricingType: "FREE" | "PREMIUM";
    price: number;
    streamingLink: string;
    posterUrl: string;
    trailerUrl: string;
    isFeatured: boolean;
    isEditorPick: boolean;
    mediaType: "MOVIE" | "SERIES";
    status: "DRAFT" | "PUBLISHED";
    genreIds: string[];
};

const pick = <T>(arr: T[], index: number) => arr[index % arr.length];

const pickCast = (index: number) => {
    return [
        pick(CAST_POOL, index),
        pick(CAST_POOL, index + 5),
        pick(CAST_POOL, index + 11),
    ];
};

const pickPlatforms = (index: number) => {
    return [
        pick(STREAMING_PLATFORMS, index),
        pick(STREAMING_PLATFORMS, index + 3),
    ];
};

const generatePosterUrl = (mediaType: "MOVIE" | "SERIES", index: number) => {
    const seed = `${mediaType.toLowerCase()}-${index + 1}`;
    return `https://picsum.photos/seed/cinetube-${seed}/800/1200`;
};

const generateStreamingLink = (title: string) => {
    return `https://www.imdb.com/find/?q=${encodeURIComponent(title)}`;
};

const generateTrailerUrl = (index: number) => {
    const trailerId = pick(TRAILER_IDS, index);
    return `https://www.youtube.com/watch?v=${trailerId}`;
};

const buildPayload = (
    title: string,
    mediaType: "MOVIE" | "SERIES",
    index: number,
    genreIds: string[],
): SeedRecord => {
    const pricingType: "FREE" | "PREMIUM" = index % 3 === 0 ? PricingType.PREMIUM : PricingType.FREE;
    const isFeatured = index % 5 === 0;
    const isEditorPick = index % 7 === 0;
    const status: "DRAFT" | "PUBLISHED" = index % 4 === 0 ? MediaStatus.DRAFT : MediaStatus.PUBLISHED;

    const baseYear = mediaType === MediaType.MOVIE ? 1980 : 1990;
    const releaseYear = baseYear + (index % 36);

    return {
        title,
        synopsis: `${title} is part of the CineTube curated ${mediaType.toLowerCase()} catalog with rich metadata and multi-filter coverage. ${SEED_TAG}`,
        releaseYear,
        director: pick(DIRECTORS, index),
        cast: pickCast(index),
        streamingPlatform: pickPlatforms(index),
        pricingType,
        price: pricingType === PricingType.PREMIUM ? Number((6.99 + (index % 8) * 2).toFixed(2)) : 0,
        streamingLink: generateStreamingLink(title),
        posterUrl: generatePosterUrl(mediaType, index),
        trailerUrl: generateTrailerUrl(index),
        isFeatured,
        isEditorPick,
        mediaType,
        status,
        genreIds,
    };
};

const ensureGenres = async () => {
    for (const genreName of DEFAULT_GENRES) {
        await prisma.genre.upsert({
            where: { name: genreName },
            update: {},
            create: { name: genreName },
        });
    }

    return prisma.genre.findMany({ orderBy: { name: "asc" } });
};

const assignGenres = (allGenreIds: string[], index: number) => {
    const first = pick(allGenreIds, index);
    const second = pick(allGenreIds, index + 3);
    const third = pick(allGenreIds, index + 7);
    return Array.from(new Set([first, second, third]));
};

const createMediaWithGenres = async (record: SeedRecord) => {
    const created = await prisma.media.create({
        data: {
            title: record.title,
            synopsis: record.synopsis,
            releaseYear: record.releaseYear,
            director: record.director,
            cast: record.cast,
            streamingPlatform: record.streamingPlatform,
            pricingType: record.pricingType,
            price: record.price,
            streamingLink: record.streamingLink,
            posterUrl: record.posterUrl,
            trailerUrl: record.trailerUrl,
            isFeatured: record.isFeatured,
            isEditorPick: record.isEditorPick,
            mediaType: record.mediaType,
            status: record.status,
            genres: {
                create: record.genreIds.map((genreId) => ({ genreId })),
            },
        },
    });

    return created.id;
};

const main = async () => {
    console.log("Seeding media records...");

    const genres = await ensureGenres();
    if (genres.length === 0) {
        throw new Error("No genres available after setup");
    }

    const genreIds = genres.map((genre) => genre.id);

    const moviePayloads = Array.from({ length: MOVIE_COUNT }, (_, index) => {
        const title = pick(MOVIE_TITLES, index);
        return buildPayload(title, MediaType.MOVIE, index, assignGenres(genreIds, index));
    });

    const seriesPayloads = Array.from({ length: SERIES_COUNT }, (_, index) => {
        const title = pick(SERIES_TITLES, index);
        return buildPayload(title, MediaType.SERIES, index + MOVIE_COUNT, assignGenres(genreIds, index + MOVIE_COUNT));
    });

    const allPayloads = [...moviePayloads, ...seriesPayloads];

    const cleanup = await prisma.media.deleteMany({
        where: {
            synopsis: {
                contains: SEED_TAG,
            },
        },
    });

    console.log(`Removed existing seeded records: ${cleanup.count}`);

    let createdCount = 0;
    for (const payload of allPayloads) {
        await createMediaWithGenres(payload);
        createdCount += 1;
    }

    const totalSeeded = await prisma.media.count({
        where: { synopsis: { contains: SEED_TAG } },
    });

    const summary = await prisma.media.groupBy({
        by: ["mediaType", "pricingType", "status", "isFeatured", "isEditorPick"],
        where: { synopsis: { contains: SEED_TAG } },
        _count: { _all: true },
    });

    console.log(`Created records in this run: ${createdCount}`);
    console.log(`Total seeded records now: ${totalSeeded}`);
    console.log("Distribution sample:");
    console.table(summary.slice(0, 20));
}

main()
    .catch((error) => {
        console.error("Media seeding failed:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
