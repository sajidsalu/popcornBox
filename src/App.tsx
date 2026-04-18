import { BrowserRouter, Route, Routes } from "react-router-dom";
import TvHomePage from "./pages/home/TvHomePage";
import MoviesHomePage from "./pages/movies/MoviesHomePage";
import MovieDetails from "./pages/movies/MovieDetails";
import FavoritesPage from "./pages/favorites/FavoritesPage";
import TVShowsPage from "./pages/tv/TVShowsPage";
import TVShowDetailsPage from "./pages/tv/tv-show-details/TVShowDetailsPage";
import WatchPage from "./pages/watch/WatchPage";
import AppShell from "./components/layout/AppShell";
import SimplePlaceholderPage from "./pages/placeholder/SimplePlaceholderPage";
import SearchPage from "./pages/search/SearchPage";
import PersonPage from "./pages/person/PersonPage";
import DiscoverPage from "./pages/discover/DiscoverPage";

const App = () => {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<TvHomePage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/movies" element={<MoviesHomePage />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/tv" element={<TVShowsPage />} />
          <Route path="/tv/:id" element={<TVShowDetailsPage />} />
          <Route path="/watch" element={<WatchPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/person/:id" element={<PersonPage />} />
          <Route path="/stats" element={<SimplePlaceholderPage titleKey="placeholder.stats" />} />
          <Route path="/history" element={<SimplePlaceholderPage titleKey="placeholder.history" />} />
          <Route path="/friends" element={<SimplePlaceholderPage titleKey="placeholder.friends" />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
};

export default App;
