"""Original editorial balance, drawn in SVG rather than a third-party icon.

The 560 × 500 frame and finial at (288.6, 82.36) preserve the companion's
existing landmark. Only the beam and its two suspended assemblies can move.
"""
from math import atan2, degrees, hypot


def _chain(x1, y1, x2, y2, count=16, back=False):
    """Alternating open/edge-on links, laid along a real suspension line."""
    dx, dy = x2 - x1, y2 - y1
    angle = -degrees(atan2(dx, dy))
    stretch = hypot(dx, dy) / count / 7.3
    links = []
    for index in range(count):
        t = (index + .5) / count
        kind = 'edge' if index % 2 else 'open'
        links.append(f'<use href="#nh-scale-link-{kind}" transform="translate({x1 + dx*t:.2f} {y1 + dy*t:.2f}) rotate({angle:.2f}) scale(1 {stretch:.3f})"/>')
    return '<g class="scale-chain' + (' scale-chain-back' if back else '') + '">' + ''.join(links) + '</g>'


def _pan(side):
    """A shallow vessel with rolled rim, concave interior and linked suspension."""
    return f'''<g class="scale-hanger scale-hanger-{side}" data-scale-hanger="">
          <g class="scale-pan">
            <path class="scale-pan-bowl" d="M-64 139C-59 159-36 177 0 179C36 177 59 159 64 139Z"/>
            <path class="scale-pan-shadow" d="M-58 148C-39 162-17 169 6 168C28 167 48 158 59 147C45 167 25 177 0 179C-27 177-46 165-58 148Z"/>
            <path class="scale-pan-etch" d="M-50 151C-34 166-17 172 0 173M-39 158C-27 169-14 173-4 175M-25 165L-19 171M28 166L23 172M43 156L38 162M11 174L16 172"/>
            <path class="scale-highlight" d="M-55 147C-46 157-32 165-22 167M-16 169L-9 171"/>
            <ellipse class="scale-pan-rim" cx="0" cy="139" rx="64" ry="11"/>
            <ellipse class="scale-pan-interior" cx="0" cy="138" rx="59" ry="7.8"/>
            <path class="scale-pan-etch" d="M-49 136C-25 130 24 130 49 136M-37 139C-18 135 18 135 37 139"/>
            <path class="scale-highlight" d="M-60 141C-38 150 28 151 53 144"/>
            <path class="scale-fine" d="M-6 178Q0 181 6 178"/>
          </g>
          <g class="scale-chains">
            <path class="scale-hook" d="M-1 1C-6 4-5 12-1 14C4 15 5 8 2 6"/>
            {_chain(0, 15, 0, 130, count=15, back=True)}
            {_chain(-2, 14, -53, 139)}
            {_chain(2, 14, 53, 139)}
            <ellipse class="scale-attachment" cx="-53" cy="139" rx="2.4" ry="3.2" transform="rotate(-23 -53 139)"/>
            <ellipse class="scale-attachment" cx="53" cy="139" rx="2.4" ry="3.2" transform="rotate(23 53 139)"/>
          </g>
        </g>'''


def nature_scene():
    return '''<figure class="nature-scene scale-scene" data-nature-scene data-scale-scene data-motion="static">
  <button class="scale-trigger" type="button" data-scale-replay aria-label="Gerakkan timbangan Nalar Hakim" aria-disabled="true">
  <svg class="nature-art scale-art" viewBox="0 0 560 500" role="img" aria-labelledby="nature-title nature-desc" xmlns="http://www.w3.org/2000/svg">
    <title id="nature-title">Timbangan Nalar Hakim</title>
    <desc id="nature-desc">Timbangan kuningan dengan poros, rantai beruas, dan dua piringan seimbang. Aktifkan gambar untuk satu gerak menimbang.</desc>
    <defs>
      <linearGradient id="nh-scale-metal" x1="0" y1="0" x2="1" y2="0"><stop stop-color="var(--scale-shade)"/><stop offset=".18" stop-color="var(--scale-face)"/><stop offset=".39" stop-color="var(--scale-light)"/><stop offset=".55" stop-color="var(--scale-face)"/><stop offset=".82" stop-color="var(--scale-shade)"/><stop offset="1" stop-color="var(--scale-face)"/></linearGradient>
      <linearGradient id="nh-scale-beam" x1="0" y1="0" x2="0" y2="1"><stop stop-color="var(--scale-light)"/><stop offset=".3" stop-color="var(--scale-face)"/><stop offset="1" stop-color="var(--scale-shade)"/></linearGradient>
      <radialGradient id="nh-scale-bowl" cx="32%" cy="8%" r="95%"><stop stop-color="var(--scale-light)"/><stop offset=".42" stop-color="var(--scale-face)"/><stop offset=".86" stop-color="var(--scale-shade)"/><stop offset="1" stop-color="var(--scale-deep)"/></radialGradient>
      <linearGradient id="nh-scale-interior" x1="0" y1="0" x2="0" y2="1"><stop stop-color="var(--scale-shade)"/><stop offset=".55" stop-color="var(--scale-face)"/><stop offset="1" stop-color="var(--scale-light)"/></linearGradient>
      <path id="nh-scale-link-open" d="M0-4C1.65-4 1.65 4 0 4C-1.65 4-1.65-4 0-4Z"/>
      <path id="nh-scale-link-edge" d="M0-4C.65-2.4.65 2.4 0 4C-.65 2.4-.65-2.4 0-4Z"/>
    </defs>
    <g class="scale-base">
      <path class="scale-base-face" d="M201 439C208 431 240 426 288.6 426C337 426 370 431 377 439V448C368 457 209 457 201 448Z"/>
      <ellipse class="scale-base-top" cx="288.6" cy="438" rx="88" ry="13"/>
      <path class="scale-fine" d="M206 448C236 457 343 457 372 448M211 445L211 448M222 448L222 451M234 450L234 453M247 451L247 454M261 452V455M316 452V455M331 451V454M346 450V453M359 448V451M369 445V448"/>
      <path class="scale-metal" d="M225 426C232 420 253 416 288.6 416C324 416 346 420 352 426L359 435C338 446 239 446 218 435Z"/>
      <ellipse class="scale-base-top" cx="288.6" cy="425" rx="63" ry="9"/>
      <path class="scale-highlight" d="M221 435C237 442 277 444 308 442M208 438C221 434 238 432 253 432"/>
      <path class="scale-base-etch" d="M320 438L324 435M329 437L332 434M337 436L340 433M345 434L347 431M230 434L232 430M239 436L240 432"/>
    </g>
    <g class="scale-column">
      <path class="scale-metal" d="M267 416C272 410 278 405 279 395L282 176H295L298 395C299 405 305 410 310 416L308 422C299 426 279 426 269 422Z"/>
      <path class="scale-column-shade" d="M291 181L294 394C295 406 301 414 306 420L296 421C291 409 289 400 289 386Z"/>
      <path class="scale-highlight" d="M285 188L282 389C282 402 278 410 274 416"/>
      <path class="scale-fine" d="M288 196L287 385M292 203L294 384M279 404C284 407 294 407 300 404M274 414C283 418 298 418 306 414"/>
      <path class="scale-collar" d="M277 386Q288.6 390 300 386V393Q288.6 398 277 393ZM276 173Q288.6 177 301 173V181Q288.6 185 276 181Z"/>
      <path class="scale-highlight" d="M279 389Q287 392 294 391M278 177Q287 180 294 179"/>
      <path class="scale-metal" d="M283 98H294C294 111 299 115 297 127L294 151H283L280 127C278 115 283 111 283 98Z"/>
      <path class="scale-fine" d="M281 119Q288.6 122 296 119M282 126Q288.6 129 295 126M283 137H294"/>
      <path class="scale-highlight" d="M285 103C285 113 282 117 284 127L286 144"/>
      <path class="scale-finial" d="M288.6 82.36C284 85 279 91 281 95C283 100 294 100 296 95C298 91 293 85 288.6 82.36Z"/>
      <path class="scale-highlight" d="M287 87C283 90 283 94 286 95"/>
      <path class="scale-collar" d="M281 98Q288.6 101 296 98V103Q288.6 106 281 103Z"/>
      <path class="scale-fixed-bracket" d="M279 145L274 151V172Q288.6 185 303 172V151L298 145L296 170Q288.6 176 281 170Z"/>
    </g>
    <g class="scale-balance" data-scale-balance="">
      <g class="scale-beam">
        <path class="scale-beam-face" d="M130 155C169 156 221 147 263 145L278 151H299L314 145C356 147 408 156 447 155L449 164C405 162 356 159 315 166L300 173H277L262 166C221 159 172 162 128 164Z"/>
        <path class="scale-beam-shadow" d="M133 161C179 158 219 155 263 160L278 166H299L314 160C358 155 398 158 444 161L449 164C405 162 356 159 315 166L300 173H277L262 166C221 159 172 162 128 164Z"/>
        <path class="scale-highlight" d="M143 157C182 156 227 149 261 148L275 154M302 154L316 148C351 149 395 156 435 157"/>
        <path class="scale-beam-etch" d="M155 160L165 158M175 159L185 156M197 157L207 154M219 156L229 152M242 156L251 151M326 151L335 156M348 152L358 156M370 154L380 157M392 156L402 159M412 158L422 160"/>
        <path class="scale-fine" d="M156 162C193 161 226 158 263 164M314 164C351 158 384 161 421 162"/>
        <ellipse class="scale-bearing" cx="134.6" cy="160" rx="6.2" ry="7"/>
        <ellipse class="scale-bearing" cx="442.6" cy="160" rx="6.2" ry="7"/>
        <ellipse class="scale-bearing-inset" cx="134.6" cy="160" rx="2.7" ry="3.4"/>
        <ellipse class="scale-bearing-inset" cx="442.6" cy="160" rx="2.7" ry="3.4"/>
      </g>
      <g transform="translate(134.6 160)">__LEFT_PAN__</g>
      <g transform="translate(442.6 160)">__RIGHT_PAN__</g>
    </g>
    <g class="scale-fixed-pivot">
      <circle class="scale-pivot" cx="288.6" cy="160" r="12.5"/>
      <circle class="scale-pivot-ring" cx="288.6" cy="160" r="9.4"/>
      <circle class="scale-pivot-inner" cx="288.6" cy="160" r="4.7"/>
      <path class="scale-fine" d="M286 162.6L291.2 157.4"/>
      <path class="scale-highlight" d="M280 158C282 151 290 149 295 154"/>
    </g>
  </svg>
  </button>
</figure>'''.replace('__LEFT_PAN__', _pan('left')).replace('__RIGHT_PAN__', _pan('right'))
