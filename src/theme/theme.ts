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
            main: mode === "dark" ? "#90caf9" : "#1976d2",
        },
        background: {
            default: mode === "dark" ? "#121212" : "#f5f5f5",
            paper: mode === "dark" ? "#1e1e1e" : "#fff",
        },
    },
    shape: {
        borderRadius: 10,
    }
})