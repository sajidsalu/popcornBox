import { Avatar, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { layoutTokens } from '../../theme/layoutTokens';

const SidebarProfile = () => {
    const { t } = useTranslation();
    const name = t('sidebar.profileName');
    const initials = name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <Box
            sx={{
                mt: 'auto',
                p: 2,
                borderTop: `1px solid ${layoutTokens.sidebar.border}`,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: layoutTokens.sidebar.profileBg,
                }}
            >
                <Avatar
                    sx={{
                        width: 44,
                        height: 44,
                        bgcolor: layoutTokens.sidebar.accent,
                        fontSize: '0.95rem',
                        fontWeight: 700,
                    }}
                >
                    {initials}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                    <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 700, color: layoutTokens.sidebar.textActive, lineHeight: 1.2 }}
                        noWrap
                    >
                        {name}
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            color: layoutTokens.sidebar.textMuted,
                            letterSpacing: '0.06em',
                            fontWeight: 600,
                            fontSize: '0.65rem',
                        }}
                    >
                        {t('sidebar.profileRole')}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default SidebarProfile;
