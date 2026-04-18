import {
  Box,
  Rating,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import type { TVEpisode } from "../../types/show.type";
import { posterUrl } from "../../lib/mediaUrls";
import { seriesUi } from "./seriesUi";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { setEpisodeRating } from "../../store/tvWatchSlice";
import { tvEpisodeKey } from "../../utils/tvWatch";

type Props = {
  episode: TVEpisode;
  showId: number;
  showName: string;
  posterPath: string | null;
  seasonNumber: number;
  watched: boolean;
  onWatchedChange: (watched: boolean) => void;
};

const DEFAULT_RUNTIME = 45;
const STAR_GOLD = "#FFC107";

const SeriesEpisodeRow = ({
  episode,
  showId,
  showName,
  posterPath,
  seasonNumber,
  watched,
  onWatchedChange,
}: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const key = tvEpisodeKey(seasonNumber, episode.episode_number);
  const yourRating = useSelector(
    (state: RootState) =>
      state.tvWatch.entries[showId]?.episodeRatings?.[key] ?? null,
  );

  const thumb = episode.still_path
    ? posterUrl(episode.still_path, "w500")
    : "https://via.placeholder.com/320x180?text=Episode";
  const minutes =
    episode.runtime && episode.runtime > 0 ? episode.runtime : DEFAULT_RUNTIME;
  const progress = watched ? 100 : 0;

  const voteAvg = episode.vote_average;
  const hasOverall =
    voteAvg != null && Number.isFinite(voteAvg) && voteAvg > 0;

  const canSubmitRating = watched && yourRating == null;
  const ratingReadOnly = yourRating != null || !watched;

  const handleRatingChange = (_: React.SyntheticEvent, value: number | null) => {
    if (value == null || !canSubmitRating) return;
    dispatch(
      setEpisodeRating({
        showId,
        name: showName,
        poster_path: posterPath,
        season: seasonNumber,
        episode: episode.episode_number,
        rating: value,
      }),
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { sm: "flex-start" },
        gap: 2,
        p: 2,
        borderRadius: 2,
        bgcolor: seriesUi.surfaceContainerLow,
        border: `1px solid ${seriesUi.surfaceContainer}`,
        transition: "background-color 0.2s",
        "&:hover": {
          bgcolor: seriesUi.surfaceContainerHigh,
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: { xs: "100%", sm: 192 },
          height: { xs: 160, sm: 112 },
          flexShrink: 0,
          borderRadius: 1.5,
          overflow: "hidden",
          "&:hover .episode-hover-play": { opacity: 1 },
        }}
      >
        <Box
          component="img"
          src={thumb}
          alt=""
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            bgcolor: seriesUi.surfaceContainerHighest,
          }}
        >
          <Box
            sx={{
              height: "100%",
              width: `${progress}%`,
              bgcolor: seriesUi.primaryContainer,
              transition: "width 0.3s",
            }}
          />
        </Box>
        <Box
          className="episode-hover-play"
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0,
            transition: "opacity 0.2s",
          }}
        >
          <PlayCircleOutlineIcon sx={{ color: "#fff", fontSize: 48 }} />
        </Box>
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 1,
            mb: 0.5,
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Manrope", sans-serif',
              fontWeight: 800,
              fontSize: "1.05rem",
              color: seriesUi.onSurface,
            }}
          >
            {episode.name}
          </Typography>
          <Switch
            checked={watched}
            onChange={(_, v) => onWatchedChange(v)}
            color="primary"
            inputProps={{ "aria-label": t("tvShow.markSeasonWatched") }}
          />
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: seriesUi.onSurfaceVariant,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            mb: 1.5,
            lineHeight: 1.5,
          }}
        >
          {episode.overview || t("tvShowDetail.noEpisodeOverview")}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <ScheduleIcon sx={{ fontSize: 16, color: seriesUi.outline }} />
            <Typography
              variant="caption"
              fontWeight={800}
              sx={{ color: seriesUi.outline, fontSize: "0.65rem" }}
            >
              {minutes} {t("tvShowDetail.min")}
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              bgcolor: seriesUi.surfaceContainerHighest,
              overflow: "hidden",
              minWidth: 40,
            }}
          >
            <Box
              sx={{
                height: "100%",
                width: `${progress}%`,
                bgcolor: seriesUi.primaryContainer,
                transition: "width 0.3s",
              }}
            />
          </Box>
          <Typography
            variant="caption"
            fontWeight={800}
            sx={{
              fontSize: "0.65rem",
              color: watched ? seriesUi.primary : seriesUi.outline,
              minWidth: 72,
              textAlign: "right",
            }}
          >
            {watched
              ? t("tvShowDetail.watchedLabel")
              : t("tvShowDetail.percentDone", { n: progress })}
          </Typography>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2.5}
          sx={{
            pt: 2,
            borderTop: `1px solid ${seriesUi.surfaceContainer}`,
          }}
        >
          <Box sx={{ minWidth: { sm: 140 } }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                letterSpacing: "0.08em",
                color: seriesUi.outline,
                textTransform: "uppercase",
                fontSize: "0.65rem",
                display: "block",
                mb: 0.5,
              }}
            >
              {t("tvShowDetail.overallRating")}
            </Typography>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "1rem",
                color: seriesUi.onSurface,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {hasOverall ? (
                <>
                  {voteAvg!.toFixed(1)}
                  <Typography
                    component="span"
                    color="text.secondary"
                    fontWeight={600}
                    sx={{ ml: 0.5 }}
                  >
                    / 10
                  </Typography>
                  <Typography
                    component="span"
                    variant="caption"
                    color="text.secondary"
                    sx={{ ml: 1, display: { xs: "none", md: "inline" } }}
                  >
                    (TMDB)
                  </Typography>
                </>
              ) : (
                t("tvShowDetail.overallRatingTbd")
              )}
            </Typography>
          </Box>

          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              ...(yourRating != null
                ? { pointerEvents: "none", userSelect: "none" }
                : {}),
            }}
            aria-readonly={yourRating != null ? true : undefined}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                letterSpacing: "0.08em",
                color: seriesUi.outline,
                textTransform: "uppercase",
                fontSize: "0.65rem",
                display: "block",
                mb: 0.5,
              }}
            >
              {t("tvShowDetail.yourRating")}
            </Typography>
            <Rating
              name={`episode-user-rating-${showId}-${key}`}
              value={yourRating ?? null}
              precision={1}
              max={5}
              readOnly={ratingReadOnly}
              onChange={handleRatingChange}
              sx={{
                "& .MuiRating-iconFilled": { color: STAR_GOLD },
                "& .MuiRating-iconHover": { color: STAR_GOLD },
                "& .MuiRating-iconEmpty": {
                  color: seriesUi.outline,
                  opacity: watched ? 0.85 : 0.45,
                },
              }}
            />
            {!watched && yourRating == null && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 0.5 }}
              >
                {t("tvShowDetail.rateAfterWatchingHint")}
              </Typography>
            )}
            {yourRating != null && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 0.25 }}
              >
                {yourRating} / 5
              </Typography>
            )}
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default SeriesEpisodeRow;
