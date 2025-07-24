import { Button, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getMovieTrailer } from "../../api/movieService";

const WatchTrailerButton = ({ movieId }: { movieId: string }) => {
    const { data = [], isLoading, isError } = useQuery({
        queryKey: ['movieTrailer', movieId],
        queryFn: () => getMovieTrailer(movieId),
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
    });

    const trailer = data.find(
        (v: any) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
    );

    const trailerUrl = trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;

    if (isLoading) return <CircularProgress size={20} />;
    if (isError || !trailerUrl) return null;

    return (
        <Button
            href={trailerUrl}
            component="a"
            target="_blank"
            rel="noopener noreferrer"
            variant="outlined"
            size="small"
            sx={{
                textTransform: 'none',
                mt: 1,
                borderRadius: 10,
                fontSize: '0.75rem',
                py: 0.5,
            }}
            onClick={(e) => e.stopPropagation()}
        >
            ▶ Trailer
        </Button>
    );
};

export default WatchTrailerButton;
