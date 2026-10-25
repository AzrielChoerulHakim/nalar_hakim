"""Original two-dimensional marks for the three publication forms."""

def render_cover(kind):
    marks = {
        'esai': '''<circle cx="288" cy="200" r="148" fill="currentColor"/>
<circle cx="504" cy="200" r="148" fill="var(--cover-bg)" stroke="currentColor" stroke-width="10"/>
<circle cx="504" cy="200" r="106" fill="none" stroke="currentColor" stroke-width="2"/>
<circle cx="504" cy="200" r="64" fill="none" stroke="currentColor" stroke-width="2"/>
<path d="M68 200H752M400 22V378" stroke="currentColor" stroke-width="2"/>
<path d="M256 200H320M288 168V232" stroke="var(--cover-bg)" stroke-width="10"/>
<path d="M480 200H528M504 176V224" stroke="currentColor" stroke-width="8"/>''',
        'telaah': '''<path d="M208 72H104V328H208M592 72H696V328H592" fill="none" stroke="currentColor" stroke-width="22"/>
<path d="M280 80H352V152H280ZM368 80H440V152H368ZM456 80H528V152H456ZM280 168H352V240H280ZM456 168H528V240H456ZM280 256H352V328H280ZM368 256H440V328H368ZM456 256H528V328H456Z" fill="currentColor"/>
<path d="M368 168H440V240H368Z" fill="none" stroke="currentColor" stroke-width="4"/>''',
        'bedah': '''<path d="M100 72H384V328H100Z" fill="currentColor"/>
<path d="M416 72H700V328H416Z" fill="none" stroke="currentColor" stroke-width="14"/>
<path d="M241 132H559V268H241Z" fill="var(--cover-bg)" stroke="var(--cover-bg)" stroke-width="20"/>
<path d="M241 132H559V268H241Z" fill="none" stroke="currentColor" stroke-width="10"/>
<path d="M100 200H210M590 200H700" stroke="var(--cover-accent)" stroke-width="14"/>''',
    }
    return '<svg class="cover-art" viewBox="0 0 800 400" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">' + marks[kind] + '</svg>'
