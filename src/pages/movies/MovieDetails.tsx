import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  IconButton,
  Paper,
  Rating,
  Stack,
  Typography,
} from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  fetchMovieCredits,
  fetchMovieRecommendations,
  fetchMovieWatchProviders,
  getMovieById,
  getMovieTrailer,
} from '../../api/movieService';
import SeriesCastCarousel from '../../components/tv-details/SeriesCastCarousel';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { addFavorite, removeFavorite } from '../../store/favoritesSlice';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import PopcornLoader from '../../components/Loader/Loader';
import { useTranslation } from 'react-i18next';
import { layoutTokens } from '../../theme/layoutTokens';
import { backdropUrl, logoUrl, posterUrl } from '../../lib/mediaUrls';
import type { Movie } from '../../types/movie.type';
import { formatUsdCompact, getUsCertification } from '../../utils/movieDetailHelpers';
import { movieDetailDark } from './movieDetailDarkUi';

const MOVIE_RATING_STORAGE = 'popcorn_movie_user_ratings';

type TrailerVideo = { site: string; type: string; key: string };

type MovieApi = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  release_date: string;
  runtime: number | null;
  vote_average: number;
  vote_count: number;
  genres: { id: number; name: string }[];
  tagline?: string;
  production_companies?: { name: string }[];
  release_dates?: unknown;
  budget: number;
  revenue: number;
};

function readStoredRating(movieId: number): number | null {
  try {
    const raw = localStorage.getItem(MOVIE_RATING_STORAGE);
    if (!raw) return null;
    const map = JSON.parse(raw) as Record<string, number>;
    const v = map[String(movieId)];
    return typeof v === 'number' && v >= 1 && v <= 5 ? v : null;
  } catch {
    return null;
  }
}

function writeStoredRating(movieId: number, value: number) {
  try {
    const raw = localStorage.getItem(MOVIE_RATING_STORAGE);
    const map: Record<string, number> = raw ? JSON.parse(raw) : {};
    map[String(movieId)] = value;
    localStorage.setItem(MOVIE_RATING_STORAGE, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

const MovieDetails = () => {
  const { id } = useParams();
  const movieId = parseInt(id || '0');
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.movies);
  const isFavorite = favorites.some((m) => m.id === movieId);

  const [castExpanded, setCastExpanded] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [ratingDraft, setRatingDraft] = useState<number | null>(null);

  const { data: movie, isLoading, isError } = useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => getMovieById(movieId) as Promise<MovieApi>,
  });

  const { data: trailers = [] } = useQuery({
    queryKey: ['trailer', movieId],
    queryFn: () => getMovieTrailer(movieId.toString()),
  });

  const { data: movieCredits } = useQuery({
    queryKey: ['movieCredits', movieId],
    queryFn: () => fetchMovieCredits(movieId),
    enabled: movieId > 0,
  });

  const { data: watchProviders } = useQuery({
    queryKey: ['watchProviders', movieId],
    queryFn: () => fetchMovieWatchProviders(movieId),
    enabled: movieId > 0,
  });

  const { data: similar = [] } = useQuery({
    queryKey: ['movieSimilar', movieId],
    queryFn: () => fetchMovieRecommendations(movieId),
    enabled: movieId > 0,
  });

  useEffect(() => {
    if (!movieId) return;
    const saved = readStoredRating(movieId);
    setUserRating(saved);
    setRatingDraft(saved);
  }, [movieId]);

  const trailer = (trailers as TrailerVideo[]).find(
    (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'),
  );
  const trailerWatchUrl = trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;

  const directors = useMemo(() => {
    const crew = movieCredits?.crew ?? [];
    const seen = new Set<string>();
    const names: string[] = [];
    for (const c of crew) {
      if (c.job !== 'Director') continue;
      if (!seen.has(c.name)) {
        seen.add(c.name);
        names.push(c.name);
      }
    }
    return names;
  }, [movieCredits]);

  const writers = useMemo(() => {
    const crew = movieCredits?.crew ?? [];
    const jobs = new Set(['Screenplay', 'Writer', 'Story']);
    const seen = new Set<string>();
    const names: string[] = [];
    for (const c of crew) {
      if (!jobs.has(c.job)) continue;
      if (!seen.has(c.name)) {
        seen.add(c.name);
        names.push(c.name);
      }
    }
    return names;
  }, [movieCredits]);

  const studioNames = useMemo(() => {
    if (!movie?.production_companies?.length) return '';
    return movie.production_companies.map((c) => c.name).join(', ');
  }, [movie]);

  const handleToggleFavorite = () => {
    if (!movie) return;
    const fav: Movie = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path ?? '',
      overview: movie.overview,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
    };
    if (isFavorite) {
      dispatch(removeFavorite(movie.id));
    } else {
      dispatch(addFavorite(fav));
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: movie?.title, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      /* ignore */
    }
  };

  const handleCommitRating = () => {
    if (ratingDraft == null || ratingDraft < 1 || !movie) return;
    writeStoredRating(movie.id, ratingDraft);
    setUserRating(ratingDraft);
  };

  if (isLoading) return <PopcornLoader />;
  if (isError || !movie) {
    return (
      <Box sx={{ p: 4, bgcolor: movieDetailDark.bg }}>
        <Typography color="error">{t('movieDetail.loadError')}</Typography>
      </Box>
    );
  }

  const backdrop =
    backdropUrl(movie.backdrop_path ?? null, 'w1280') ??
    posterUrl(movie.poster_path ?? null, 'w780');

  const year = movie.release_date?.slice(0, 4) ?? '—';
  const runtimeMin = movie.runtime && movie.runtime > 0 ? movie.runtime : null;
  const genreMeta =
    movie.genres?.map((g) => g.name.toUpperCase()).join(' • ') ?? '';
  const usCert = getUsCertification(movie.release_dates);

  const usWatch = watchProviders?.results?.US;
  const flatrate = usWatch?.flatrate?.[0];
  const rent = usWatch?.rent?.[0];
  const buy = usWatch?.buy?.[0];

  const cast = movieCredits?.cast ?? [];
  const castLimit = castExpanded ? 24 : 8;
  const showCastToggle = cast.length > 8;

  const similarStrip = similar.slice(0, 8);
  const ratedLocked = userRating != null;

  return (
    <Box sx={{ bgcolor: movieDetailDark.bg, minHeight: '100%', color: movieDetailDark.text, pb: 6 }}>
      {/* Hero */}
      <Box sx={{ position: 'relative', minHeight: { xs: 420, md: 520 } }}>
        <Box
          component="img"
          src={backdrop}
          alt=""
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: movieDetailDark.heroOverlay,
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pt: 2, pb: { xs: 6, md: 8 }, px: { xs: 2, md: 3 } }}>
          <IconButton
            onClick={() => navigate(-1)}
            aria-label={t('common.back')}
            sx={{
              mb: 2,
              color: '#fff',
              bgcolor: 'rgba(255,255,255,0.08)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.16)' },
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1.5} sx={{ mb: 2 }}>
            {movie.vote_average >= 8 && (
              <Chip
                label={t('movieDetail.featured')}
                size="small"
                sx={{
                  bgcolor: 'rgba(45, 212, 191, 0.25)',
                  color: '#5eead4',
                  fontWeight: 900,
                  letterSpacing: '0.12em',
                  border: '1px solid rgba(45, 212, 191, 0.45)',
                }}
              />
            )}
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <StarRoundedIcon sx={{ color: '#fbbf24', fontSize: 26 }} />
              <Typography fontWeight={800} sx={{ color: '#fff', fontSize: '1.1rem' }}>
                {movie.vote_average.toFixed(1)}
                <Typography component="span" sx={{ color: 'rgba(255,255,255,0.65)', fontWeight: 600 }}>
                  /10
                </Typography>
              </Typography>
            </Stack>
            {usCert && (
              <Chip
                label={usCert}
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#e2e8f0', fontWeight: 800 }}
              />
            )}
          </Stack>

          <Typography
            sx={{
              fontFamily: '"Manrope", sans-serif',
              fontWeight: 900,
              fontStyle: 'italic',
              fontSize: { xs: '2rem', md: '3rem' },
              lineHeight: 1.05,
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
              color: '#fff',
              textShadow: '0 4px 32px rgba(0,0,0,0.5)',
              mb: 2,
            }}
          >
            {movie.title}
          </Typography>

          <Typography
            sx={{
              color: 'rgba(226, 232, 240, 0.92)',
              fontWeight: 600,
              letterSpacing: '0.06em',
              fontSize: '0.85rem',
              mb: 3,
            }}
          >
            {year}
            {runtimeMin != null ? ` • ${runtimeMin} ${t('movieDetail.min')}` : ''}
            {genreMeta ? ` • ${genreMeta}` : ''}
          </Typography>

          <Stack direction="row" flexWrap="wrap" gap={1.5}>
            <Button
              component={trailerWatchUrl ? 'a' : 'button'}
              href={trailerWatchUrl ?? undefined}
              target={trailerWatchUrl ? '_blank' : undefined}
              rel="noopener noreferrer"
              disabled={!trailerWatchUrl}
              variant="contained"
              size="large"
              startIcon={<PlayArrowIcon />}
              sx={{
                px: 3,
                py: 1.25,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 800,
                bgcolor: layoutTokens.sidebar.accent,
                boxShadow: '0 8px 24px rgba(59, 130, 246, 0.35)',
                '&:hover': { bgcolor: '#2563eb' },
              }}
            >
              {t('movieDetail.watchTrailer')}
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={isFavorite ? <StarRoundedIcon /> : <AddIcon />}
              onClick={handleToggleFavorite}
              sx={{
                px: 3,
                py: 1.25,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 800,
                bgcolor: 'rgba(255,255,255,0.1)',
                color: '#f8fafc',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.16)' },
              }}
            >
              {isFavorite ? t('movieDetail.inWatchlist') : t('movieDetail.watchlistShort')}
            </Button>
            <IconButton
              onClick={handleShare}
              sx={{
                bgcolor: 'rgba(255,255,255,0.1)',
                color: '#f8fafc',
                borderRadius: 2,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.16)' },
              }}
              aria-label={t('movieDetail.share')}
            >
              <ShareOutlinedIcon />
            </IconButton>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 }, mt: { xs: -2, md: -3 } }}>
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3 },
                borderRadius: 3,
                bgcolor: movieDetailDark.surfaceElevated,
                border: `1px solid ${movieDetailDark.border}`,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: movieDetailDark.accent,
                  fontWeight: 800,
                  letterSpacing: '0.16em',
                  display: 'block',
                  mb: 1.5,
                }}
              >
                {t('movieDetail.synopsis')}
              </Typography>
              <Typography sx={{ color: 'rgba(226, 232, 240, 0.92)', lineHeight: 1.8, mb: 2 }}>
                {movie.overview || t('movieDetail.noOverview')}
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {movie.genres?.map((g) => (
                  <Chip
                    key={g.id}
                    label={g.name}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(148, 163, 184, 0.12)',
                      color: '#e2e8f0',
                      fontWeight: 600,
                      border: `1px solid ${movieDetailDark.border}`,
                    }}
                  />
                ))}
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3 },
                borderRadius: 3,
                bgcolor: movieDetailDark.surfaceElevated,
                border: `1px solid ${movieDetailDark.border}`,
                height: '100%',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: movieDetailDark.accent,
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  display: 'block',
                  mb: 2,
                }}
              >
                {t('movieDetail.directorWriting')}
              </Typography>
              <Stack spacing={2}>
                {directors.length > 0 && (
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ color: 'rgba(148, 163, 184, 0.95)', letterSpacing: '0.1em', fontWeight: 800 }}
                    >
                      {t('movieDetail.directorsLabel')}
                    </Typography>
                    <Typography fontWeight={700} sx={{ color: '#f8fafc' }}>
                      {directors.join(' & ')}
                    </Typography>
                  </Box>
                )}
                {writers.length > 0 && (
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ color: 'rgba(148, 163, 184, 0.95)', letterSpacing: '0.1em', fontWeight: 800 }}
                    >
                      {t('movieDetail.writersLabel')}
                    </Typography>
                    <Typography fontWeight={600} sx={{ color: 'rgba(241, 245, 249, 0.95)', fontSize: '0.9rem' }}>
                      {writers.join(', ')}
                    </Typography>
                  </Box>
                )}
                {studioNames && (
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ color: 'rgba(148, 163, 184, 0.95)', letterSpacing: '0.1em', fontWeight: 800 }}
                    >
                      {t('movieDetail.studioLabel')}
                    </Typography>
                    <Typography fontWeight={600} sx={{ color: '#f8fafc' }}>
                      {studioNames}
                    </Typography>
                  </Box>
                )}
                <Box sx={{ pt: 1, borderTop: `1px solid ${movieDetailDark.border}` }}>
                  <Typography variant="caption" color="text.secondary">
                    {t('movieDetail.budget')}:{' '}
                    <Typography component="span" fontWeight={700} color="inherit">
                      {formatUsdCompact(movie.budget)}
                    </Typography>
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                    {t('movieDetail.revenue')}:{' '}
                    <Typography component="span" fontWeight={700} sx={{ color: movieDetailDark.accent }}>
                      {formatUsdCompact(movie.revenue)}
                    </Typography>
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {(!usWatch || (!flatrate && !rent && !buy)) ? null : (
          <Paper
            elevation={0}
            sx={{
              mt: 2.5,
              p: 2.5,
              borderRadius: 3,
              bgcolor: movieDetailDark.surfaceElevated,
              border: `1px solid ${movieDetailDark.border}`,
            }}
          >
            <Typography fontWeight={900} sx={{ mb: 2, fontFamily: '"Manrope", sans-serif' }}>
              {t('movieDetail.whereToWatch')}
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flexWrap="wrap">
              {flatrate && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box
                    component="img"
                    src={logoUrl(flatrate.logo_path, 'w45') ?? ''}
                    alt=""
                    sx={{ width: 36, height: 36, borderRadius: 1 }}
                  />
                  <Box>
                    <Typography fontWeight={800}>{flatrate.provider_name}</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(148, 163, 184, 0.95)' }}>
                      {t('movieDetail.streamingSubscription')}
                    </Typography>
                  </Box>
                  <OpenInNewIcon sx={{ fontSize: 18, color: 'rgba(148, 163, 184, 0.8)' }} />
                </Stack>
              )}
              {rent && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box
                    component="img"
                    src={logoUrl(rent.logo_path, 'w45') ?? ''}
                    alt=""
                    sx={{ width: 36, height: 36, borderRadius: 1 }}
                  />
                  <Typography fontWeight={700}>{rent.provider_name}</Typography>
                  <ShoppingCartOutlinedIcon sx={{ fontSize: 18, color: 'rgba(148, 163, 184, 0.8)' }} />
                </Stack>
              )}
              {buy && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box
                    component="img"
                    src={logoUrl(buy.logo_path, 'w45') ?? ''}
                    alt=""
                    sx={{ width: 36, height: 36, borderRadius: 1 }}
                  />
                  <Typography fontWeight={700}>{buy.provider_name}</Typography>
                  <ShoppingCartOutlinedIcon sx={{ fontSize: 18, color: 'rgba(148, 163, 184, 0.8)' }} />
                </Stack>
              )}
            </Stack>
          </Paper>
        )}

        {cast.length > 0 && (
          <Box sx={{ mt: 4 }} id="movie-cast">
            <SeriesCastCarousel
              cast={cast}
              limit={castLimit}
              showSubtitle={false}
              variant="dark"
              headingOverride={t('movieDetail.topCast')}
              headerExtra={
                showCastToggle ? (
                  <Button
                    size="small"
                    onClick={() => setCastExpanded((e) => !e)}
                    sx={{
                      fontWeight: 800,
                      textTransform: 'none',
                      color: movieDetailDark.accent,
                    }}
                  >
                    {castExpanded ? t('movieDetail.viewLess') : t('movieDetail.viewAll')}
                  </Button>
                ) : null
              }
            />
          </Box>
        )}

        <Grid container spacing={2.5} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3 },
                borderRadius: 3,
                bgcolor: movieDetailDark.surfaceElevated,
                border: `1px solid ${movieDetailDark.border}`,
                height: '100%',
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <PushPinOutlinedIcon sx={{ color: movieDetailDark.accent }} />
                <Typography
                  sx={{
                    color: movieDetailDark.accent,
                    fontWeight: 800,
                    letterSpacing: '0.14em',
                  }}
                >
                  {t('movieDetail.triviaHeading')}
                </Typography>
              </Stack>
              <Stack spacing={2}>
                {(['movieDetail.trivia1', 'movieDetail.trivia2', 'movieDetail.trivia3'] as const).map(
                  (key, i) => (
                    <Box key={key} sx={{ display: 'flex', gap: 2 }}>
                      <Typography
                        sx={{
                          color: 'rgba(148, 163, 184, 0.85)',
                          fontWeight: 900,
                          fontSize: '0.85rem',
                          minWidth: 28,
                        }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </Typography>
                      <Typography sx={{ color: 'rgba(226, 232, 240, 0.9)', lineHeight: 1.65, fontSize: '0.9rem' }}>
                        {t(key)}
                      </Typography>
                    </Box>
                  ),
                )}
              </Stack>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3 },
                borderRadius: 3,
                bgcolor: movieDetailDark.surfaceElevated,
                border: `1px solid ${movieDetailDark.border}`,
                height: '100%',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: movieDetailDark.accent,
                  fontWeight: 800,
                  letterSpacing: '0.14em',
                  display: 'block',
                  mb: 1,
                }}
              >
                {t('movieDetail.rateTitle')}
              </Typography>
              <Typography sx={{ color: 'rgba(148, 163, 184, 0.95)', mb: 2, fontSize: '0.9rem' }}>
                {t('movieDetail.rateSubtitle')}
              </Typography>
              <Rating
                name="movie-user-rate"
                value={(ratedLocked ? userRating : ratingDraft) ?? null}
                precision={1}
                readOnly={ratedLocked}
                onChange={(_, v) => setRatingDraft(v)}
                sx={{
                  mb: 2,
                  '& .MuiRating-iconFilled': { color: '#fbbf24' },
                }}
              />
              <Button
                variant="outlined"
                disabled={ratedLocked || ratingDraft == null || ratingDraft < 1}
                onClick={handleCommitRating}
                sx={{
                  borderColor: movieDetailDark.accent,
                  color: movieDetailDark.accent,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  '&:hover': { borderColor: '#7dd3fc', color: '#7dd3fc' },
                }}
              >
                {ratedLocked ? t('movieDetail.ratedThanks') : t('movieDetail.rateNow')}
              </Button>
            </Paper>
          </Grid>
        </Grid>

        {similarStrip.length > 0 && (
          <Box sx={{ mt: 5 }}>
            <Typography
              sx={{
                fontFamily: '"Manrope", sans-serif',
                fontWeight: 900,
                fontStyle: 'italic',
                fontSize: '1.25rem',
                color: '#f8fafc',
                mb: 2,
              }}
            >
              {t('movieDetail.youMightAlsoLike')}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                overflowX: 'auto',
                pb: 1,
                scrollbarWidth: 'thin',
                '&::-webkit-scrollbar': { height: 6 },
              }}
            >
              {similarStrip.map((m) => (
                <Box
                  key={m.id}
                  component={Link}
                  to={`/movie/${m.id}`}
                  sx={{
                    flex: '0 0 140px',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <Box
                    component="img"
                    src={posterUrl(m.poster_path || null, 'w342')}
                    alt=""
                    sx={{
                      width: 140,
                      aspectRatio: '2/3',
                      objectFit: 'cover',
                      borderRadius: 2,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
                      border: `1px solid ${movieDetailDark.border}`,
                    }}
                  />
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    sx={{ mt: 1, display: 'block', color: '#e2e8f0' }}
                  >
                    {m.title}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default MovieDetails;
