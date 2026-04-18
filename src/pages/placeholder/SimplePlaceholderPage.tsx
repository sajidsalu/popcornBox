import { Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

type Props = {
    titleKey: string;
};

const SimplePlaceholderPage = ({ titleKey }: Props) => {
    const { t } = useTranslation();
    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
                {t(titleKey)}
            </Typography>
            <Typography color="text.secondary">{t('placeholder.comingSoon')}</Typography>
        </Container>
    );
};

export default SimplePlaceholderPage;
