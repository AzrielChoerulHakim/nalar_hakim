"""Original engraved scales: a static, accessible SVG with optional finite motion.

The 560 × 500 coordinate frame intentionally preserves the existing companion
animation's landmark. No third-party illustration or animation asset is used.
"""


def _pan(side):
    """A suspended assembly in local coordinates, centred below its bearing."""
    return f'''<g class="scale-hanger scale-hanger-{side}" data-scale-hanger="">
          <g class="scale-chains" data-scale-reveal="chains">
            <ellipse cx="0" cy="7" rx="4" ry="6"/>
            <path d="M-2 13L-49 132M2 13L49 132M0 14V132"/>
            <path class="scale-chain-etch" d="M-5 25L-9 27M-10 38L-14 40M-15 51L-19 53M-20 64L-24 66M-25 77L-29 79M-30 90L-34 92M-35 103L-39 105M-40 116L-44 118M5 25L9 27M10 38L14 40M15 51L19 53M20 64L24 66M25 77L29 79M30 90L34 92M35 103L39 105M40 116L44 118"/>
            <path class="scale-chain-light" d="M1 18V127"/>
          </g>
          <g class="scale-pan" data-scale-reveal="pans">
            <path class="scale-pan-bowl" d="M-60 134C-49 157-28 167 0 167C28 167 49 157 60 134Z"/>
            <path class="scale-pan-shade" d="M-51 141C-37 158-17 161 0 161C18 161 37 156 51 141C34 146 18 149 0 149C-18 149-34 146-51 141Z"/>
            <ellipse class="scale-pan-rim" cx="0" cy="134" rx="61" ry="6"/>
            <path class="scale-fine" d="M-44 148Q0 171 44 148M-30 154L-27 158M-18 159L-16 162M18 159L16 162M30 154L27 158"/>
            <path class="scale-highlight" d="M-46 132Q0 126 46 132"/>
            <path class="scale-pan-foot" d="M-8 168H8M-5 171H5"/>
          </g>
        </g>'''


def nature_scene():
    return '''<figure class="nature-scene scale-scene" data-nature-scene data-scale-scene data-motion="static">
  <svg class="nature-art scale-art" viewBox="0 0 560 500" role="img" aria-labelledby="nature-title nature-desc" xmlns="http://www.w3.org/2000/svg">
    <title id="nature-title">Timbangan Nalar Hakim</title>
    <desc id="nature-desc">Timbangan dengan dua piringan seimbang, digambar dengan garis dan detail ukiran.</desc>
    <defs>
      <linearGradient id="nh-scale-metal" x1="0" y1="0" x2="1" y2="0"><stop stop-color="var(--scale-shade)"/><stop offset=".22" stop-color="var(--scale-face)"/><stop offset=".49" stop-color="var(--scale-light)"/><stop offset=".7" stop-color="var(--scale-face)"/><stop offset="1" stop-color="var(--scale-shade)"/></linearGradient>
      <linearGradient id="nh-scale-bowl" x1="0" y1="0" x2="0" y2="1"><stop stop-color="var(--scale-light)"/><stop offset=".42" stop-color="var(--scale-face)"/><stop offset="1" stop-color="var(--scale-shade)"/></linearGradient>
    </defs>
    <g class="scale-base" data-scale-reveal="base">
      <path class="scale-metal" d="M228 422H349L357 433H220Z"/>
      <path class="scale-base-face" d="M209 433H368L376 446H201Z"/>
      <path class="scale-base-step" d="M200 446H377V454H200Z"/>
      <path class="scale-highlight" d="M215 435H362M205 448H372"/>
      <path class="scale-fine" d="M218 440H359M211 451H366M235 425H341"/>
      <path class="scale-base-hatching" d="M211 437L207 443M219 437L215 443M227 437L223 443M235 437L231 443M243 437L239 443M251 437L247 443M259 437L255 443M267 437L263 443M275 437L271 443M283 437L279 443M291 437L287 443M299 437L295 443M307 437L303 443M315 437L311 443M323 437L319 443M331 437L327 443M339 437L335 443M347 437L343 443M355 437L351 443M363 437L359 443"/>
    </g>
    <g class="scale-column" data-scale-reveal="column">
      <path class="scale-metal" d="M273 421C276 411 279 402 279 390L282 168H295L298 390C298 402 301 411 304 421Z"/>
      <path class="scale-column-shade" d="M291 183L294 390Q294 408 300 419H292L287 184Z"/>
      <path class="scale-highlight" d="M285 188L282 391Q282 407 279 417"/>
      <path class="scale-fine" d="M288 196V386M280 399H297M277 411H301"/>
      <path class="scale-collar" d="M278 171H299V178H278ZM276 390H301V397H276ZM270 416H307V423H270Z"/>
      <path class="scale-metal" d="M284 88H293L297 121L294 153H283L280 121Z"/>
      <path class="scale-highlight" d="M285 95L284 123L286 149"/>
      <path class="scale-fine" d="M283 116H294M283 125H294M284 136H293"/>
      <path class="scale-finial" d="M288.6 82.36C283 86 280 90 281 94C282 98 286 100 288.6 100C292 100 296 98 297 94C298 90 294 86 288.6 82.36Z"/>
      <path class="scale-highlight" d="M288 87Q283 91 285 95"/>
    </g>
    <g class="scale-balance" data-scale-balance="">
      <g class="scale-beam" data-scale-reveal="beam">
        <path class="scale-metal" d="M128 157Q146 153 164 155L267 153L279 147H298L310 153L413 155Q431 153 449 157L449 165Q431 162 413 163L310 168L298 173H279L267 168L164 163Q146 162 128 165Z"/>
        <path class="scale-highlight" d="M143 158L266 157L280 151H297L311 157L434 158"/>
        <path class="scale-fine" d="M151 161L267 163M310 163L426 161M278 156L298 166M280 165L297 156"/>
        <path class="scale-beam-etch" d="M175 158V162M185 158V163M195 158V163M205 158V163M215 157V164M225 157V164M235 157V164M245 157V164M332 157V164M342 157V164M352 157V164M362 157V164M372 158V163M382 158V163M392 158V163M402 158V162"/>
        <ellipse class="scale-bearing" cx="134.6" cy="160" rx="6" ry="6"/>
        <ellipse class="scale-bearing" cx="442.6" cy="160" rx="6" ry="6"/>
        <circle class="scale-pivot" cx="288.6" cy="160" r="12"/>
        <circle class="scale-pivot-inner" cx="288.6" cy="160" r="6"/>
        <path class="scale-highlight" d="M282 156Q285 151 290 153"/>
      </g>
      <g transform="translate(134.6 160)">__LEFT_PAN__</g>
      <g transform="translate(442.6 160)">__RIGHT_PAN__</g>
    </g>
  </svg>
  <button class="scale-replay" type="button" data-scale-replay hidden>Ulangi gerak timbangan</button>
</figure>'''.replace('__LEFT_PAN__', _pan('left')).replace('__RIGHT_PAN__', _pan('right'))
