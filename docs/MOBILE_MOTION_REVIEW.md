# Mobile animation decision and review
- Selected S01 only; no dominant narrative mechanism. Touch press feedback is an ordinary control state, not a second scroll system.
- Article range includes headings, cover, argument and references; does not count related cards or footer. Progress is reversible and disappears outside the reading range or with reduced motion.
- Previous Chromium run 45657624089: 221 states, 43 flags; all 320px, search button right edge 323px and landing navigation text-spacing overflow. Search form layout and landing navigation recomposed; closed details are excluded from geometry probes (open details remain tested).
- Reading order on phones: brand/navigation, article title and metadata, cover, prose, references, related reading, footer. No overlay on prose other than a 3px noninteractive edge indicator.
- No new SVG, framework, font or imagery. Source and generated HTML updated together; exporter now copies all reading-cleanup inputs.
- Current commit must be verified by GitHub Actions. Automated geometry is not manual screenshot review, device certification, contrast verification or full Design OS release approval.
