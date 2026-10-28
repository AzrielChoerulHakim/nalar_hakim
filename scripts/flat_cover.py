"""Abstract editorial collages for fallback covers and the shared quote portal.

Broad, overlapping planes distinguish the three forms without depicting or
inventing an article's subject. No image selection or publication logic lives here.
"""

def render_cover(kind):
    marks = {
        'esai': '''<g stroke="#263F35" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
<path fill="#263F35" d="M122 111 272 64 347 91 329 180 368 261 282 328 148 291 164 207 112 169Z"/>
<path fill="#B28A47" d="M426 93 571 73 667 136 647 258 547 329 466 290 488 207Z"/>
<path fill="#E9DFC9" d="M257 116 414 81 464 127 432 199 494 259 442 322 284 286 311 210Z"/>
<path fill="#A6533D" d="M181 251 311 210 284 286 353 302 282 328 148 291Z"/>
<path fill="#A6533D" d="M464 127 571 73 557 177 488 207 432 199Z"/>
<path fill="none" d="m334 134 67-15-15 44m156 71 45-25 23-55"/>
<path fill="none" stroke="#E9DFC9" stroke-width="3" d="m166 162 8-30 58-14"/>
</g>''',
        'telaah': '''<g stroke="#263F35" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
<path fill="#E9DFC9" d="M147 104 373 71 424 123 395 190 455 250 397 327 176 300 130 217 160 170Z"/>
<path fill="#263F35" d="M288 89 488 60 627 112 658 201 618 284 438 325 400 263 469 222 499 157 420 142 364 178 283 157Z"/>
<path fill="#B28A47" d="M179 177 364 178 420 142 499 157 469 222 373 245 190 222Z"/>
<path fill="#A6533D" d="M438 325 400 263 469 222 618 284 539 319Z"/>
<path fill="#E9DFC9" d="M491 93 579 115 596 170 538 183 550 142 477 124Z"/>
<path fill="none" d="m185 146-2-20 65-6m-31 144 72 16 46-3m-95-74 91 2 40-12"/>
<path fill="none" stroke="#E9DFC9" stroke-width="3" d="m547 232 48-12 15-27"/>
</g>''',
        'bedah': '''<g stroke="#263F35" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
<path fill="#263F35" d="M126 102 282 65 354 105 326 176 359 270 294 326 139 300 151 211 112 166Z"/>
<path fill="#E9DFC9" d="M444 79 605 91 666 164 642 226 660 299 494 331 433 277 463 194 417 133Z"/>
<path fill="#B28A47" d="M294 326 359 270 326 176 354 105 282 65 293 163 267 233Z"/>
<path fill="#A6533D" d="M463 194 642 226 660 299 494 331 533 269 433 277Z"/>
<path fill="#E9DFC9" d="M227 144 385 126 420 153 397 202 423 250 289 268 267 233 299 194Z"/>
<path fill="#B28A47" d="M444 79 605 91 666 164 567 150 530 120 417 133Z"/>
<path fill="none" d="m315 157 58-9-8 28m-58 60 68-11m120-55 49 14 31 40"/>
<path fill="none" stroke="#E9DFC9" stroke-width="3" d="m166 150 4-22 50-10m-53 126 3 23 41 8"/>
</g>''',
    }
    return '<svg class="cover-art" viewBox="0 0 800 400" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">' + marks[kind] + '</svg>'
