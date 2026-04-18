import { useCallback, useRef, useState } from 'react';
import {
    Box,
    TextField,
    InputAdornment,
    Paper,
    Popper,
    ClickAwayListener,
    Typography,
    Chip,
    Button,
    CircularProgress,
    List,
    ListItemButton,
    Divider,
    useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { layoutTokens } from '../../theme/layoutTokens';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { searchMulti } from '../../api/searchService';
import { mapMultiToDisplay, getThumbUrl, type SearchDisplayItem } from './searchMappers';

const MIN_QUERY = 2;
const DEBOUNCE_MS = 350;
const DROPDOWN_LIMIT = 8;

function hitHref(item: SearchDisplayItem): string {
    if (item.mediaType === 'movie') return `/movie/${item.id}`;
    if (item.mediaType === 'tv') return `/tv/${item.id}`;
    return `/person/${item.id}`;
}

const SearchBar = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();
    const isLight = theme.palette.mode === 'light';
    const anchorRef = useRef<HTMLDivElement>(null);
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const debounced = useDebouncedValue(query, DEBOUNCE_MS);

    const trimmed = query.trim();
    const debouncedTrim = debounced.trim();
    const canSearch = debouncedTrim.length >= MIN_QUERY;
    const openDropdown = open && trimmed.length >= MIN_QUERY;

    const { data: rawResults = [], isFetching, isFetched } = useQuery({
        queryKey: ['searchMulti', debouncedTrim],
        queryFn: () => searchMulti(debounced),
        enabled: canSearch,
        staleTime: 60_000,
    });

    const items = mapMultiToDisplay(rawResults).slice(0, DROPDOWN_LIMIT);
    const showEmpty = canSearch && isFetched && !isFetching && rawResults.length === 0;

    const handleClose = useCallback(() => setOpen(false), []);

    const handleViewAll = () => {
        const q = debouncedTrim || trimmed;
        if (q.length >= MIN_QUERY) {
            navigate(`/search?q=${encodeURIComponent(q)}`);
        }
        handleClose();
    };

    return (
        <ClickAwayListener onClickAway={handleClose}>
            <Box ref={anchorRef} sx={{ position: 'relative', width: '100%', maxWidth: { md: 560 } }}>
                <TextField
                    placeholder={t('header.searchPlaceholder')}
                    size="small"
                    fullWidth
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: layoutTokens.radius.input,
                            bgcolor: isLight ? '#F8FAFC' : 'rgba(255,255,255,0.04)',
                        },
                    }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: 'text.secondary', fontSize: 22 }} />
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                <Popper
                    open={openDropdown}
                    anchorEl={anchorRef.current}
                    placement="bottom-start"
                    style={{ width: anchorRef.current?.offsetWidth, zIndex: 1300 }}
                    modifiers={[{ name: 'offset', options: { offset: [0, 8] } }]}
                >
                    <Paper
                        elevation={8}
                        sx={{
                            borderRadius: 2,
                            overflow: 'hidden',
                            maxHeight: 420,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        {isFetching && canSearch && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                                <CircularProgress size={28} />
                            </Box>
                        )}

                        {!isFetching && showEmpty && (
                            <Typography color="text.secondary" sx={{ px: 2, py: 3, textAlign: 'center' }}>
                                {t('search.noResults')}
                            </Typography>
                        )}

                        {!isFetching && items.length > 0 && (
                            <List dense disablePadding sx={{ py: 0 }}>
                                {items.map((item, index) => (
                                    <Box key={`${item.mediaType}-${item.id}`}>
                                        {index > 0 && <Divider />}
                                        <ListItemButton
                                            component={Link}
                                            to={hitHref(item)}
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={handleClose}
                                            sx={{ alignItems: 'flex-start', gap: 1.5, py: 1.25, px: 2 }}
                                        >
                                            <Box
                                                component="img"
                                                src={getThumbUrl(item)}
                                                alt=""
                                                sx={{
                                                    width: 40,
                                                    height: 56,
                                                    objectFit: 'cover',
                                                    borderRadius: 1,
                                                    flexShrink: 0,
                                                    bgcolor: 'action.hover',
                                                }}
                                            />
                                            <Box sx={{ minWidth: 0, flex: 1 }}>
                                                <Typography variant="subtitle2" fontWeight={700} noWrap>
                                                    {item.title}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.25 }}>
                                                    <Chip
                                                        size="small"
                                                        label={t(`search.badge.${item.mediaType}`)}
                                                        sx={{
                                                            height: 22,
                                                            fontSize: '0.65rem',
                                                            fontWeight: 800,
                                                            bgcolor: 'rgba(25, 118, 210, 0.12)',
                                                            color: layoutTokens.sidebar.accent,
                                                        }}
                                                    />
                                                    <Typography variant="caption" color="text.secondary" noWrap>
                                                        {item.subtitle}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </ListItemButton>
                                    </Box>
                                ))}
                            </List>
                        )}

                        {openDropdown && canSearch && !isFetching && (
                            <Box sx={{ p: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
                                <Button
                                    fullWidth
                                    size="small"
                                    onClick={handleViewAll}
                                    sx={{ fontWeight: 700, textTransform: 'none' }}
                                >
                                    {t('search.viewAll')}
                                </Button>
                            </Box>
                        )}
                    </Paper>
                </Popper>
            </Box>
        </ClickAwayListener>
    );
};

export default SearchBar;
