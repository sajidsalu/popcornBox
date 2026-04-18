import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    Box,
    Container,
    Typography,
    Chip,
    Stack,
    IconButton,
    Paper,
    Link as MuiLink,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {
    fetchPersonById,
    fetchPersonCombinedCredits,
    pickKnownForCredits,
    sortFilmography,
} from '../../api/personService';
import { profileUrl } from '../../lib/mediaUrls';
import PopcornLoader from '../../components/Loader/Loader';
import { useTranslation } from 'react-i18next';
import { seriesUi } from '../../components/tv-details/seriesUi';
import PersonKnownForCard from '../../components/person/PersonKnownForCard';
import PersonFilmographyRow from '../../components/person/PersonFilmographyRow';

function formatDisplayDate(iso: string | null): string | null {
    if (!iso) return null;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

const PersonPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const personId = Number(id);
    const { t } = useTranslation();

    const { data: person, isLoading, isError } = useQuery({
        queryKey: ['person', personId],
        queryFn: () => fetchPersonById(personId),
        enabled: Number.isFinite(personId) && personId > 0,
    });

    const { data: credits = [], isLoading: creditsLoading } = useQuery({
        queryKey: ['personCredits', personId],
        queryFn: () => fetchPersonCombinedCredits(personId),
        enabled: Number.isFinite(personId) && personId > 0,
    });

    if (isLoading) return <PopcornLoader />;
    if (isError || !person) {
        return (
            <Container sx={{ py: 4 }}>
                <Typography color="error">{t('search.personLoadError')}</Typography>
            </Container>
        );
    }

    const img = profileUrl(person.profile_path, 'h632');
    const knownFor = pickKnownForCredits(credits, 8);
    const filmography = sortFilmography(credits);
    const bioParagraphs = (person.biography || '')
        .split(/\n\n+/)
        .map((p) => p.trim())
        .filter(Boolean);

    const born = formatDisplayDate(person.birthday);
    const died = formatDisplayDate(person.deathday ?? null);
    const metaLine = [born && `${t('personPage.born')}: ${born}${died ? ` – ${died}` : ''}`, person.place_of_birth && `${t('personPage.from')}: ${person.place_of_birth}`]
        .filter(Boolean)
        .join(' · ');

    return (
        <Box sx={{ bgcolor: seriesUi.surface, pb: 6, minHeight: '100%' }}>
            <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 }, pt: 2, pb: 4 }}>
                <IconButton
                    onClick={() => navigate(-1)}
                    aria-label={t('common.back')}
                    sx={{
                        mb: 2,
                        bgcolor: 'background.paper',
                        border: `1px solid ${seriesUi.surfaceContainer}`,
                        '&:hover': { bgcolor: seriesUi.surfaceContainerLow },
                    }}
                >
                    <ArrowBackIcon />
                </IconButton>

                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={4}
                    sx={{ mb: 4, alignItems: { md: 'flex-start' } }}
                >
                    <Box
                        sx={{
                            flexShrink: 0,
                            alignSelf: { xs: 'center', md: 'flex-start' },
                        }}
                    >
                        <Box
                            component="img"
                            src={img}
                            alt=""
                            sx={{
                                width: { xs: 260, sm: 300 },
                                maxWidth: '100%',
                                borderRadius: 3,
                                objectFit: 'cover',
                                boxShadow: '0 12px 40px rgba(15, 23, 42, 0.12)',
                                border: `1px solid ${seriesUi.surfaceContainer}`,
                            }}
                        />
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            variant="h3"
                            sx={{
                                fontFamily: '"Manrope", sans-serif',
                                fontWeight: 900,
                                letterSpacing: '-0.03em',
                                color: seriesUi.onSurface,
                                fontSize: { xs: '1.75rem', sm: '2.25rem' },
                                mb: 1.5,
                            }}
                        >
                            {person.name}
                        </Typography>

                        {person.known_for_department && (
                            <Chip
                                label={person.known_for_department}
                                size="small"
                                sx={{
                                    mb: 2,
                                    fontWeight: 800,
                                    bgcolor: 'rgba(25, 118, 210, 0.12)',
                                    color: seriesUi.primary,
                                }}
                            />
                        )}

                        {metaLine ? (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.7 }}>
                                {metaLine}
                            </Typography>
                        ) : null}

                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                            {t('personPage.popularity')}: {person.popularity?.toFixed(1) ?? '—'}
                        </Typography>

                        {person.homepage ? (
                            <MuiLink
                                href={person.homepage}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    fontWeight: 700,
                                    mb: 2,
                                }}
                            >
                                {t('personPage.officialSite')} <OpenInNewIcon sx={{ fontSize: 16 }} />
                            </MuiLink>
                        ) : null}

                        {person.also_known_as && person.also_known_as.length > 0 && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                                <Typography component="span" fontWeight={800} color={seriesUi.onSurfaceVariant}>
                                    {t('personPage.alsoKnownAs')}:{' '}
                                </Typography>
                                {person.also_known_as.slice(0, 5).join(', ')}
                            </Typography>
                        )}
                    </Box>
                </Stack>

                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2, sm: 3 },
                        mb: 4,
                        borderRadius: 3,
                        bgcolor: '#fff',
                        border: `1px solid ${seriesUi.surfaceContainer}`,
                        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.06)',
                    }}
                >
                    <Typography
                        variant="caption"
                        sx={{
                            fontWeight: 800,
                            letterSpacing: '0.12em',
                            color: seriesUi.outline,
                            textTransform: 'uppercase',
                            display: 'block',
                            mb: 2,
                        }}
                    >
                        {t('personPage.biography')}
                    </Typography>
                    {bioParagraphs.length > 0 ? (
                        bioParagraphs.map((para, i) => (
                            <Typography
                                key={i}
                                variant="body1"
                                sx={{ mb: i < bioParagraphs.length - 1 ? 2 : 0, lineHeight: 1.75, color: seriesUi.onSurfaceVariant }}
                            >
                                {para}
                            </Typography>
                        ))
                    ) : (
                        <Typography color="text.secondary">{t('search.noBiography')}</Typography>
                    )}
                </Paper>

                {!creditsLoading && knownFor.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                        <Typography
                            sx={{
                                fontFamily: '"Manrope", sans-serif',
                                fontWeight: 900,
                                fontSize: '1.35rem',
                                color: seriesUi.onSurface,
                                mb: 2,
                            }}
                        >
                            {t('personPage.knownFor')}
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2,
                                overflowX: 'auto',
                                pb: 1,
                                mx: { xs: -2, md: 0 },
                                px: { xs: 2, md: 0 },
                                scrollbarWidth: 'thin',
                            }}
                        >
                            {knownFor.map((c) => (
                                <PersonKnownForCard key={`${c.mediaType}-${c.id}`} credit={c} />
                            ))}
                        </Box>
                    </Box>
                )}

                {!creditsLoading && (
                    <Box>
                        <Typography
                            sx={{
                                fontFamily: '"Manrope", sans-serif',
                                fontWeight: 900,
                                fontSize: '1.35rem',
                                color: seriesUi.onSurface,
                                mb: 2,
                            }}
                        >
                            {t('personPage.filmography')}
                        </Typography>
                        {filmography.length > 0 ? (
                            <Stack spacing={2}>
                                {filmography.map((c) => (
                                    <PersonFilmographyRow key={`${c.mediaType}-${c.id}`} credit={c} />
                                ))}
                            </Stack>
                        ) : (
                            <Typography color="text.secondary">{t('personPage.noCredits')}</Typography>
                        )}
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default PersonPage;
