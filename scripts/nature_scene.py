"""Engraved Justitia portrait against a quiet sky."""


def nature_scene():
    return '''<figure class="nature-scene" data-nature-scene data-motion="static">
  <svg class="nature-art" viewBox="0 0 560 500" role="img" aria-labelledby="nature-title nature-desc" xmlns="http://www.w3.org/2000/svg">
    <title id="nature-title">Dewi Justitia</title>
    <desc id="nature-desc">Ilustrasi Dewi Justitia bertutup mata, membawa timbangan dan pedang, dengan burung di langit.</desc>
    <defs>
      <clipPath id="nature-sky-atmosphere-clip"><circle cx="284" cy="256" r="218"/></clipPath>
      <radialGradient id="nature-cloud-soft"><stop offset="0" stop-color="#F5F6F2" stop-opacity=".8"/><stop offset=".62" stop-color="#F5F6F2" stop-opacity=".42"/><stop offset="1" stop-color="#F5F6F2" stop-opacity="0"/></radialGradient>
      <linearGradient id="nature-sky-depth" x1="0" y1="0" x2="0" y2="1"><stop stop-color="var(--n-sky-high)"/><stop offset="1" stop-color="var(--n-sky-low)"/></linearGradient>
      <radialGradient id="nature-plinth-shadow"><stop stop-color="var(--n-shadow)" stop-opacity=".3"/><stop offset=".55" stop-color="var(--n-shadow)" stop-opacity=".14"/><stop offset="1" stop-color="var(--n-shadow)" stop-opacity="0"/></radialGradient>
    </defs>
    <circle class="nature-sky" cx="284" cy="256" r="218"/>
    <circle class="nature-sun" cx="365" cy="105" r="23"/>
    <g class="nature-clouds" fill="none" stroke="currentColor" stroke-width="1">
      <path class="nature-compact-detail" d="M67 193H150M96 186H178M362 149H444M386 156H465"/>
      <g class="nature-desktop-detail nature-horizon-wisps" stroke-width=".65" stroke-linecap="round">
        <path d="M73 196C95 192 106 196 128 193S161 193 177 190M87 201C111 199 120 202 141 199M360 151C385 147 398 153 422 149S448 151 466 148M387 157C408 155 433 159 451 155M82 344C108 338 124 343 146 340M362 361C395 354 420 360 454 351"/>
      </g>
    </g>
    <!-- Desktop-only translucent wisps pass behind the complete foreground. -->
    <g class="nature-desktop-atmosphere nature-atmosphere-clouds" clip-path="url(#nature-sky-atmosphere-clip)" aria-hidden="true">
      <g class="nature-cloud-drift nature-cloud-drift-one" fill="url(#nature-cloud-soft)">
        <ellipse cx="200" cy="117" rx="100" ry="22"/><ellipse cx="170" cy="110" rx="40" ry="24"/><ellipse cx="225" cy="108" rx="48" ry="28"/>
      </g>
      <g class="nature-cloud-drift nature-cloud-drift-two" fill="url(#nature-cloud-soft)">
        <ellipse cx="380" cy="190" rx="108" ry="21"/><ellipse cx="355" cy="181" rx="43" ry="27"/><ellipse cx="407" cy="185" rx="37" ry="24"/>
      </g>
    </g>
    <!-- Silhouettes have a body, forked tail and independent shoulder-hinged wings. -->
    <g class="nature-birds" fill="currentColor" stroke="none">
      <g class="nature-bird nature-bird-one"><g transform="translate(90 70) scale(1)">
        <path class="nature-bird-body" d="M-4 1Q-1 -2 3 -1L5 -3L7 -2L6 0L9 1L5 2Q1 5-3 3L-8 6L-6 2L-9 0Z"/>
        <g class="nature-wing nature-wing-near"><path class="nature-compact-detail" d="M1 1C-6 -4-14 -9-25 -8L-18 -5L-20 -4C-11 -4-8 1-3 3Z"/><path class="nature-desktop-detail" d="M1 1C-5 -3-13 -8-25 -8L-21 -5L-23 -4L-18 -3L-20 -1L-15 -1L-16 1L-11 1L-11 3Q-6 2-3 4Z"/><path class="nature-desktop-detail nature-feather-etch" d="M-3 1Q-12 -4-19 -4M-8 1L-15 -2"/></g>
        <g class="nature-wing nature-wing-far"><path class="nature-compact-detail" d="M2 1C7 -8 16 -13 26 -12L21 -9L23 -8C14 -7 10 -3 5 3Z"/><path class="nature-desktop-detail" d="M2 1C6 -7 15 -13 26 -12L23 -9L25 -8L21 -7L22 -5L18 -4L18 -2L14 -1Q10 0 5 3Z"/><path class="nature-desktop-detail nature-feather-etch" d="M6 0Q13 -8 22 -9M11 -3L17 -5"/></g>
      </g></g>
      <g class="nature-bird nature-bird-two"><g transform="translate(151 52) scale(0.76)">
        <path class="nature-bird-body" d="M-4 1Q-1 -2 3 -1L5 -3L7 -2L6 0L9 1L5 2Q1 5-3 3L-8 6L-6 2L-9 0Z"/>
        <g class="nature-wing nature-wing-near"><path class="nature-compact-detail" d="M1 1C-6 -4-14 -9-25 -8L-18 -5L-20 -4C-11 -4-8 1-3 3Z"/><path class="nature-desktop-detail" d="M1 1C-5 -3-13 -8-25 -8L-21 -5L-23 -4L-18 -3L-20 -1L-15 -1L-16 1L-11 1L-11 3Q-6 2-3 4Z"/><path class="nature-desktop-detail nature-feather-etch" d="M-3 1Q-12 -4-19 -4M-8 1L-15 -2"/></g>
        <g class="nature-wing nature-wing-far"><path class="nature-compact-detail" d="M2 1C7 -8 16 -13 26 -12L21 -9L23 -8C14 -7 10 -3 5 3Z"/><path class="nature-desktop-detail" d="M2 1C6 -7 15 -13 26 -12L23 -9L25 -8L21 -7L22 -5L18 -4L18 -2L14 -1Q10 0 5 3Z"/><path class="nature-desktop-detail nature-feather-etch" d="M6 0Q13 -8 22 -9M11 -3L17 -5"/></g>
      </g></g>
      <g class="nature-bird nature-bird-three"><g transform="translate(205 69) scale(0.63)">
        <path class="nature-bird-body" d="M-4 1Q-1 -2 3 -1L5 -3L7 -2L6 0L9 1L5 2Q1 5-3 3L-8 6L-6 2L-9 0Z"/>
        <g class="nature-wing nature-wing-near"><path class="nature-compact-detail" d="M1 1C-6 -4-14 -9-25 -8L-18 -5L-20 -4C-11 -4-8 1-3 3Z"/><path class="nature-desktop-detail" d="M1 1C-5 -3-13 -8-25 -8L-21 -5L-23 -4L-18 -3L-20 -1L-15 -1L-16 1L-11 1L-11 3Q-6 2-3 4Z"/><path class="nature-desktop-detail nature-feather-etch" d="M-3 1Q-12 -4-19 -4M-8 1L-15 -2"/></g>
        <g class="nature-wing nature-wing-far"><path class="nature-compact-detail" d="M2 1C7 -8 16 -13 26 -12L21 -9L23 -8C14 -7 10 -3 5 3Z"/><path class="nature-desktop-detail" d="M2 1C6 -7 15 -13 26 -12L23 -9L25 -8L21 -7L22 -5L18 -4L18 -2L14 -1Q10 0 5 3Z"/><path class="nature-desktop-detail nature-feather-etch" d="M6 0Q13 -8 22 -9M11 -3L17 -5"/></g>
      </g></g>
    </g>
    <ellipse cx="284" cy="466" rx="90" ry="11" fill="url(#nature-plinth-shadow)"/>
    <image class="nature-justitia-portrait" href="preview/justitia-engraving-v3.webp" x="129" y="65" width="274" height="411" preserveAspectRatio="xMidYMid meet"/>
  </svg>
</figure>'''
