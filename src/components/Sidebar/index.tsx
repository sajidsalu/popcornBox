import { ExpandMore } from "@mui/icons-material";
import { Drawer, Box, Typography, IconButton, List, ListItem, ListItemText, Divider, Collapse } from "@mui/material";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import logo from '../../assets/popcorn.png';
import CloseIcon from '@mui/icons-material/Close';

type SidebarProps = {
    isOpenSidebar: boolean;
    onCloseSidebar: () => void;
}
const Sidebar = (props: SidebarProps) => {

    const { isOpenSidebar, onCloseSidebar } = props;
    const navigate = useNavigate();

    const { t, i18n } = useTranslation();
    const [showLangOptions, setShowLangOptions] = useState(false);

    const currentLang = i18n.language;

    const closeSidebar = () => {
        setShowLangOptions(false);
        onCloseSidebar();
    };

    const handleLanguageChange = (lang: string) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('preferredLanguage', lang);
        closeSidebar();
    };

    const handleMenuClick = (route: string) => {
        if (route === "Movies") {
            navigate("/");
        }
        else if (route === "TV Shows") {
            navigate("/tv");
        }
        closeSidebar();
    };

    return (
        <Drawer anchor="left" open={isOpenSidebar} onClose={closeSidebar}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 2,
                    py: 1.5,
                }}
                onClick={closeSidebar}
                onKeyDown={closeSidebar}
            >
                <Box
                    component={Link}
                    to="/"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        textDecoration: 'none',
                        color: 'inherit'
                    }}
                >
                    <img src={logo} alt="Logo" style={{ width: 32, height: 32, marginRight: 8 }} />
                    <Typography variant="h6" noWrap>
                        {t('title')}
                    </Typography>
                </Box>

                <IconButton onClick={closeSidebar} size="small">
                    <CloseIcon />
                </IconButton>

            </Box>

            <Box sx={{ width: 250 }} role="presentation">
                <List>
                    {['Movies', 'TV Shows', 'Watch'].map((text) => (
                        <ListItem key={text} sx={{
                            cursor: "pointer",
                        }} onClick={() => handleMenuClick(text)}>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>

                <Divider />

                <List>
                    <ListItem onClick={() => setShowLangOptions((prev) => !prev)}>
                        <ListItemText primary={`Language: ${currentLang.toUpperCase()}`} />
                        <ExpandMore sx={{ transform: showLangOptions ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
                    </ListItem>
                    <Collapse in={showLangOptions} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {[
                                { code: 'en', label: 'English', flag: '🇺🇸' },
                                { code: 'fr', label: 'French', flag: '🇫🇷' },
                                { code: 'es', label: 'Spanish', flag: '🇪🇸' },
                            ].map(({ code, label, flag }) => (
                                <ListItem
                                    key={code}
                                    sx={{ pl: 4 }}
                                    onClick={() => handleLanguageChange(code)}
                                >
                                    <ListItemText primary={`${flag} ${label}`} />
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
                </List>
            </Box>
        </Drawer>

    )
};

export default memo(Sidebar);