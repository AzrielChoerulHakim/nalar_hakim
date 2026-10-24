"""Original two-dimensional editorial marks; inline vectors need no asset requests."""


def render_cover(channel):
    marks = {
        'pidana': '''<path d="M70 74H294V298H70Z" fill="currentColor"/>
<path d="M110 114H254V258H110Z" fill="var(--cover-bg)"/>
<path d="M352 56V330M440 56V330M528 56V330M616 56V330M704 56V330" stroke="currentColor" stroke-width="22"/>
<path d="M330 194H728" stroke="var(--cover-bg)" stroke-width="26"/>
<path d="M330 194H728" stroke="currentColor" stroke-width="6"/>
<path d="M70 330H294" stroke="currentColor" stroke-width="6"/>''',
        'perdata': '''<path d="M100 72H384V328H100Z" fill="currentColor"/>
<path d="M416 72H700V328H416Z" fill="none" stroke="currentColor" stroke-width="14"/>
<path d="M241 132H559V268H241Z" fill="var(--cover-bg)" stroke="var(--cover-bg)" stroke-width="20"/>
<path d="M241 132H559V268H241Z" fill="none" stroke="currentColor" stroke-width="10"/>
<path d="M100 200H210M590 200H700" stroke="var(--cover-accent)" stroke-width="14"/>''',
        'agama-keluarga': '''<path d="M80 278V202C80 108 156 60 224 60S368 108 368 202V278" fill="none" stroke="currentColor" stroke-width="38"/>
<path d="M432 122V198C432 292 508 340 576 340S720 292 720 198V122" fill="none" stroke="currentColor" stroke-width="38"/>
<path d="M224 156V244C224 322 300 346 368 310L432 90C500 54 576 78 576 156V244" fill="none" stroke="currentColor" stroke-width="8"/>
<circle cx="224" cy="202" r="24" fill="currentColor"/><circle cx="576" cy="198" r="24" fill="currentColor"/>''',
        'filsafat-hukum': '''<circle cx="288" cy="200" r="148" fill="currentColor"/>
<circle cx="504" cy="200" r="148" fill="var(--cover-bg)" stroke="currentColor" stroke-width="10"/>
<circle cx="504" cy="200" r="106" fill="none" stroke="currentColor" stroke-width="2"/>
<circle cx="504" cy="200" r="64" fill="none" stroke="currentColor" stroke-width="2"/>
<path d="M68 200H752M400 22V378" stroke="currentColor" stroke-width="2"/>
<path d="M256 200H320M288 168V232" stroke="var(--cover-bg)" stroke-width="10"/>
<path d="M480 200H528M504 176V224" stroke="currentColor" stroke-width="8"/>''',
        'hukum-teknologi': '''<path d="M208 72H104V328H208M592 72H696V328H592" fill="none" stroke="currentColor" stroke-width="22"/>
<path d="M280 80H352V152H280ZM368 80H440V152H368ZM456 80H528V152H456ZM280 168H352V240H280ZM456 168H528V240H456ZM280 256H352V328H280ZM368 256H440V328H368ZM456 256H528V328H456Z" fill="currentColor"/>
<path d="M368 168H440V240H368Z" fill="none" stroke="currentColor" stroke-width="4"/>''',
    }
    return '<svg class="cover-art" viewBox="0 0 800 400" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">' + marks[channel] + '</svg>'
