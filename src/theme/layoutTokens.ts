/** Dashboard layout tokens (sidebar + main) — independent of MUI palette mode for the rail */
export const layoutTokens = {
    sidebar: {
        width: 260,
        bg: '#0A0B14',
        border: '#151825',
        textMuted: 'rgba(148, 163, 184, 0.92)',
        textActive: '#E2E8F0',
        accent: '#3B82F6',
        accentGlow: 'rgba(59, 130, 246, 0.35)',
        profileBg: '#13151F',
    },
    main: {
        light: '#F1F5F9',
        dark: '#0f172a',
    },
    radius: {
        card: 14,
        pill: 999,
        input: 12,
    },
} as const;
