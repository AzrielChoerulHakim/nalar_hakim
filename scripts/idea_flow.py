"""A quiet editorial adaptation of the original converging signal field."""


def render_idea_flow():
    strands, packets = [], []
    for index in range(13):
        start = 24 + index * 28
        end = 360 - start + 24
        curve = (f'M -30 {start} C 200 {start} 350 192 600 192 '
                 f'C 850 192 1000 {end} 1230 {end}')
        strands.append(f'<path d="{curve}"/>')
        if index % 2 == 0:
            delay = index * -.71
            packets.append(f'<g class="idea-packet" style="--packet-delay:{delay}s">'
                           f'<path class="idea-tail" pathLength="1000" d="{curve}"/>'
                           f'<path class="idea-head" pathLength="1000" d="{curve}"/></g>')
    return '''<section id="gagasan" class="idea-flow landing-shell" data-idea-flow data-flow-state="static" aria-labelledby="idea-flow-title">
  <div class="landing-section-top"><p>04 / PERJALANAN GAGASAN</p><span aria-hidden="true">↗</span></div>
  <div class="idea-flow-heading"><h2 id="idea-flow-title">Dari gagasan,<br><em>menjadi percakapan.</em></h2><p>Tulisan Anda dibaca redaksi, lalu tersedia untuk siapa saja tanpa biaya.</p></div>
  <div class="idea-flow-stage">
    <svg class="idea-flow-lines" viewBox="0 0 1200 384" preserveAspectRatio="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="idea-strand-fade"><stop offset="0" stop-color="var(--flow-line)" stop-opacity="0"/><stop offset=".14" stop-color="var(--flow-line)" stop-opacity=".65"/><stop offset=".5" stop-color="var(--flow-line)"/><stop offset=".86" stop-color="var(--flow-line)" stop-opacity=".65"/><stop offset="1" stop-color="var(--flow-line)" stop-opacity="0"/></linearGradient></defs>
      <g class="idea-strands">''' + ''.join(strands) + '''</g><g class="idea-packets">''' + ''.join(packets) + '''</g>
    </svg>
    <div class="idea-flow-nodes">
      <div class="idea-node idea-source"><span class="idea-node-number">01 / PENULIS</span><h3>Ide Anda</h3><span class="idea-node-point" aria-hidden="true"></span></div>
      <div class="idea-node idea-hub"><span class="idea-hub-orbit" aria-hidden="true"></span><span class="idea-node-number">02 / REDAKSI</span><h3>NALAR<br>HAKIM<span>.</span></h3><span class="idea-hub-rule" aria-hidden="true"></span></div>
      <div class="idea-node idea-destination"><span class="idea-node-number">03 / PEMBACA</span><h3>Masyarakat</h3><span class="idea-node-point" aria-hidden="true"></span></div>
    </div>
  </div>
  <ol class="idea-flow-notes"><li><strong>Anda menulis.</strong><p>Ajukan persoalan hukum yang Anda anggap perlu dibahas, dengan nama samaran.</p></li><li><strong>Redaksi membaca.</strong><p>Lazarus meninjau argumen dan sumber, lalu membicarakan penyuntingan dengan Anda.</p></li><li><strong>Siapa saja bisa membaca.</strong><p>Naskah yang terbit tersedia gratis, tanpa akun atau langganan.</p></li></ol>
  <div class="idea-flow-bottom"><p>Dari penulis dengan nama samaran, untuk pembaca seluas-luasnya.</p><a href="beranda.html">Buka ruang baca <span aria-hidden="true">↗</span></a></div>
</section>'''
