export interface CreateMovieDTO {
    PK: string;
    SK: string;
    movieId: string;
    movieImDbId: string;
    language: string;
    genres: APIGenders[],
    title: string;
    overview: string;
    popularity: number;
    posterPath: string;
    releaseDate: string;
    video: string | boolean;
    voteAverage: number;
    voteCount: number;
    createdAt: string | Date;
    updatedAt: string | Date;
}

export interface CreateFavoriteMovieDTO {
    userId: string;
    movieId: string;
    updatedAt: string | Date;
    createdAt: string | Date;
}

export interface CreateFavoriteMovieDTO {
    userId: string;
    movieId: string;
    updatedAt: string | Date;
    createdAt: string | Date;
}

export interface createMovieNoteDTO {
    userId: string;
    movieId: string;
    noteTitle: string;
    description: string;
    updatedAt: string | Date;
    createdAt: string | Date;
}

export interface APIGenders {
    id: number;
    name: string
}