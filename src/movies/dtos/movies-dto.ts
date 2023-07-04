export interface CreateMovieDTO {
    movieApiId: string;
    movieId: string;
    movieImDbId: string;
    language: string;
    genres: APIGenders[],
    title: string;
    overview: string;
    popularity: number;
    posterPath: string;
    releaseDate: string;
    video: string;
    voteAverage: number;
    voteCount: number;
}

export interface APIGenders {
    id: number;
    name: string
}