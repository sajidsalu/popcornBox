export type TVShowDetails = {
    id: number;
    name: string;
    overview: string;
    first_air_date: string;
    poster_path: string;
    vote_average: number;
    number_of_seasons: number;
    number_of_episodes: number;
    genres: { id: number; name: string }[];
};