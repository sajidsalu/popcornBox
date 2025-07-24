import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MovieDetails from "./pages/MovieDetails";
import FavoritesPage from "./pages/FavoritesPage";
import Header from "./components/Header";
import { Box } from "@mui/material";
import TvShowsPage from "./pages/TVShowsPage";
import TvShowDetailsPage from "./pages/TVShowDetails";

const App = () => {
  return (
    <BrowserRouter>
      <Box sx={{ display: "flex", flex: 1, flexDirection: "column", minHeight: '100vh' }}>
        <Header />
        <Box>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/tv" element={<TvShowsPage />} />
            <Route path="/tv/:id" element={<TvShowDetailsPage />} />

          </Routes>
        </Box>
      </Box>
    </BrowserRouter>
  );
};

export default App;
