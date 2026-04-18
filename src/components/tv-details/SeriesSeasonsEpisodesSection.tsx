import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { fetchTvSeasonDetails } from "../../api/tvService";
import type { TVSeasonSummary, TVShowDetails } from "../../types/show.type";
import type { RootState } from "../../store/store";
import { setEpisodeWatched, setSeasonWatched } from "../../store/tvWatchSlice";
import { tvEpisodeKey } from "../../utils/tvWatch";
import SeriesEpisodeRow from "./SeriesEpisodeRow";
import { seriesUi } from "./seriesUi";

type Props = {
  show: TVShowDetails;
  seasons: TVSeasonSummary[];
  sectionId?: string;
};

const SeriesSeasonsEpisodesSection = ({ show, seasons, sectionId }: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const watchedMap = useSelector(
    (state: RootState) => state.tvWatch.entries[show.id]?.watchedEpisodes ?? {},
  );

  const sorted = useMemo(
    () => [...seasons].sort((a, b) => b.season_number - a.season_number),
    [seasons],
  );

  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);

  useEffect(() => {
    if (sorted.length && selectedSeason == null) {
      setSelectedSeason(sorted[0].season_number);
    }
  }, [sorted, selectedSeason]);

  const { data: seasonDetail, isLoading } = useQuery({
    queryKey: ["tvSeason", show.id, selectedSeason],
    queryFn: () => fetchTvSeasonDetails(show.id, selectedSeason!),
    enabled: selectedSeason != null && selectedSeason >= 0,
  });

  const episodes = useMemo(() => {
    const eps = seasonDetail?.episodes ?? [];
    return [...eps].sort((a, b) => a.episode_number - b.episode_number);
  }, [seasonDetail]);

  const handleMarkSeason = () => {
    if (!selectedSeason || !episodes.length) return;
    const nums = episodes.map((e) => e.episode_number);
    const allOn = nums.every(
      (n) => watchedMap[tvEpisodeKey(selectedSeason, n)],
    );
    dispatch(
      setSeasonWatched({
        showId: show.id,
        name: show.name,
        poster_path: show.poster_path,
        season: selectedSeason,
        episodeNumbers: nums,
        watched: !allOn,
      }),
    );
  };

  const allSeasonWatched =
    selectedSeason != null &&
    episodes.length > 0 &&
    episodes.every(
      (e) => watchedMap[tvEpisodeKey(selectedSeason, e.episode_number)],
    );

  return (
    <Box id={sectionId}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ sm: "flex-end" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: '"Manrope", sans-serif',
              fontWeight: 900,
              fontSize: "1.75rem",
              color: seriesUi.onSurface,
              letterSpacing: "-0.02em",
            }}
          >
            {t("tvShow.seasonsAndEpisodes")}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: seriesUi.outline,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              mt: 0.5,
              display: "block",
            }}
          >
            {t("tvShowDetail.seasonEpisodeCounts", {
              seasons: show.number_of_seasons,
              episodes: show.number_of_episodes,
            })}
          </Typography>
        </Box>
        <Button
          size="small"
          variant="text"
          onClick={handleMarkSeason}
          disabled={!episodes.length}
          sx={{
            fontWeight: 800,
            textTransform: "none",
            alignSelf: { xs: "flex-start", sm: "auto" },
          }}
        >
          {allSeasonWatched
            ? t("tvShowDetail.unmarkSeason")
            : t("tvShowDetail.markSeasonShort")}
        </Button>
      </Stack>

      <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 3 }}>
        {sorted.map((s) => {
          const active = selectedSeason === s.season_number;
          return (
            <Button
              key={s.id}
              onClick={() => setSelectedSeason(s.season_number)}
              sx={{
                borderRadius: 999,
                px: 2,
                py: 0.75,
                fontSize: "0.75rem",
                fontWeight: active ? 800 : 600,
                textTransform: "none",
                bgcolor: active
                  ? seriesUi.primaryContainer
                  : seriesUi.surfaceContainer,
                color: active ? "#fff" : seriesUi.onSurfaceVariant,
                boxShadow: "none",
                "&:hover": {
                  bgcolor: active
                    ? seriesUi.primary
                    : seriesUi.surfaceContainerHigh,
                },
              }}
            >
              {t("tvShowDetail.seasonN", { n: s.season_number })}
            </Button>
          );
        })}
      </Stack>

      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {!isLoading && selectedSeason != null && (
        <Stack spacing={2}>
          {episodes.map((ep) => (
            <SeriesEpisodeRow
              key={ep.id}
              episode={ep}
              showId={show.id}
              showName={show.name}
              posterPath={show.poster_path}
              seasonNumber={selectedSeason}
              watched={
                !!watchedMap[tvEpisodeKey(selectedSeason, ep.episode_number)]
              }
              onWatchedChange={(watched) =>
                dispatch(
                  setEpisodeWatched({
                    showId: show.id,
                    name: show.name,
                    poster_path: show.poster_path,
                    season: selectedSeason,
                    episode: ep.episode_number,
                    watched,
                  }),
                )
              }
            />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default SeriesSeasonsEpisodesSection;
