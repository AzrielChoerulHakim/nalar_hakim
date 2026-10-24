"""Original flat vector paths for the landing's flowing signal field."""


def render_signal_field():
    paths = []
    signals = []
    for index in range(19):
        start = -34 + index * 33
        end = 552 - start
        middle = 278
        path = (f'M -70 {start} C 320 {start} 570 {middle} 900 {middle} '
                f'C 1125 {middle} 1255 {end} 1510 {end}')
        paths.append(f'<path d="{path}"/>')
        if index in (1, 3, 5, 7, 9, 11, 13, 15, 17):
            signals.append(f'<g class="signal-packet" data-signal="{index}"><path class="signal-tail" pathLength="1000" d="{path}"/><path class="signal-head" pathLength="1000" d="{path}"/></g>')
    return ('<div class="landing-signal-field" aria-hidden="true">'
            '<svg viewBox="0 0 1440 550" preserveAspectRatio="none" focusable="false" xmlns="http://www.w3.org/2000/svg">'
            '<defs><linearGradient id="signal-line-fade"><stop offset="0" stop-color="var(--accent)" stop-opacity="0"/>'
            '<stop offset=".18" stop-color="var(--accent)" stop-opacity=".75"/>'
            '<stop offset=".63" stop-color="var(--accent)"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/>'
            '</linearGradient></defs><g class="signal-strands">' + ''.join(paths) + '</g>'
            '<g class="signal-packets">' + ''.join(signals) + '</g>'
            '<circle class="signal-junction" cx="900" cy="278" r="3"/>'
            '<circle class="signal-junction-ring" cx="900" cy="278" r="11"/>'
            '</svg></div>')
