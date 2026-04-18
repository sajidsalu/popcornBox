import { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import { useTranslation } from 'react-i18next';

const storageKey = (showId: number) => `popcorn_tv_notes_${showId}`;

type Props = {
    showId: number;
};

const SeriesNotesCard = ({ showId }: Props) => {
    const { t } = useTranslation();
    const [note, setNote] = useState('');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(storageKey(showId));
            setNote(raw ?? '');
        } catch {
            setNote('');
        }
    }, [showId]);

    const handleSave = () => {
        try {
            localStorage.setItem(storageKey(showId), note);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch {
            /* ignore */
        }
    };

    return (
        <Box
            sx={{
                mt: 4,
                bgcolor: 'rgba(25, 118, 210, 0.05)',
                border: '1px solid rgba(25, 118, 210, 0.12)',
                borderRadius: 4,
                p: 4,
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <EditNoteOutlinedIcon color="primary" />
                <Typography sx={{ fontFamily: '"Manrope", sans-serif', fontWeight: 800, fontSize: '1.25rem' }}>
                    {t('tvShowDetail.personalNotes')}
                </Typography>
            </Box>
            <TextField
                multiline
                rows={4}
                fullWidth
                placeholder={t('tvShowDetail.notesPlaceholder')}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: 'rgba(255,255,255,0.6)',
                    },
                }}
            />
            <Button
                fullWidth
                variant="contained"
                sx={{ mt: 2, py: 1.5, fontWeight: 800, borderRadius: 2, textTransform: 'none' }}
                onClick={handleSave}
            >
                {saved ? t('tvShowDetail.notesSaved') : t('tvShowDetail.saveNote')}
            </Button>
        </Box>
    );
};

export default SeriesNotesCard;
