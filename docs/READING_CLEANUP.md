# Nalar Hakim — Zero-noise editorial pass

Basis: Lazarus Design OS, AGENTS.md zero-noise rule, Tone of Voice System, Anti-Generic Audit. User requested casual Indonesian and removal of generic features, SVGs and language. This is a targeted maintenance pass, not a new design direction.

- Voice: casual-editorial Indonesian, reader addressed as kamu, redaksi as kami. No invented personal statements; original manuscript and title remain unchanged. Publication terms, source and privacy limitations remain.
- Removed decorative navigation SVGs, repeated eyebrows, visual serials (not article codes), initials avatar, repeated card CTAs, motion scripts, idea-flow ornament, fake interactive balance control and duplicated generic quote cover.
- Kept signature static cubist balance, genuine article illustrations, archive, search, dark mode, article numbers, source links, table of contents, email and voluntary donation controls.
- Existing reading typography and palette retained. Responsive channel grid simplified without a new font or design direction.
- Current generated HTML updated alongside generator cleanup. Legacy redirects not touched. Old unused assets retained because the separate admin/WordPress may still reference them.
- Release status: static markup checks only; no rendered screenshots, browser testing, full Python regeneration or VPS comparison verified. Do not claim the full Design OS release gate passed. Before deployment run build-preview.py, check-preview.py and desktop/mobile screenshot QA (320/390/640/768/1024/1440, short-height, zoom, keyboard, contrast).

Verified against the previous HTML: all five article content blocks before the references section are byte-for-byte identical, and all source URLs match. Original selected slogans and article numbering were retained. 185 inline SVG instances before, one afterward (the balance). 15 nonredirect pages checked for one main/H1, duplicate IDs and local fragment targets. Search still works with title links; redundant generated read CTA removed. This does not replace browser or Python build QA.
