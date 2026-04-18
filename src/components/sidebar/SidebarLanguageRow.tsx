import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { layoutTokens } from '../../theme/layoutTokens';

type Props = {
    onSelectLanguage?: () => void;
};

const codes = ['en', 'fr', 'es'] as const;

const SidebarLanguageRow = ({ onSelectLanguage }: Props) => {
    const { i18n } = useTranslation();

    return (
        <Box sx={{ px: 2, pb: 1.5, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {codes.map((code) => {
                const active = i18n.language.startsWith(code);
                return (
                    <Button
                        key={code}
                        size="small"
                        onClick={() => {
                            void i18n.changeLanguage(code);
                            localStorage.setItem('preferredLanguage', code);
                            onSelectLanguage?.();
                        }}
                        sx={{
                            minWidth: 40,
                            px: 1,
                            py: 0.25,
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            color: active ? layoutTokens.sidebar.textActive : layoutTokens.sidebar.textMuted,
                            border: `1px solid ${active ? layoutTokens.sidebar.accent : 'transparent'}`,
                            bgcolor: active ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
                        }}
                    >
                        {code.toUpperCase()}
                    </Button>
                );
            })}
        </Box>
    );
};

export default SidebarLanguageRow;
