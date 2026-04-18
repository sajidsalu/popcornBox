import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#1976d2",
        },
        background: {
            default: "#f5f5f5",
        },
    },
    shape: {
        borderRadius: 10
    }
})

export const getAppTheme = (mode: 'light' | 'dark') => createTheme({
    palette: {
        mode,
        primary: {
            main: mode === "dark" ? "#60a5fa" : "#3B82F6",
        },
        background: {
            default: mode === "dark" ? "#0f172a" : "#F1F5F9",
            paper: mode === "dark" ? "#1e293b" : "#ffffff",
        },
    },
    shape: {
        borderRadius: 12,
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
})