"""New Cubist balance artwork with the existing animation and perch anchors."""
from pathlib import Path


def nature_scene():
    artwork = (Path(__file__).resolve().parents[1] / 'preview' / 'cubist-scale.svg').read_text(encoding='utf-8')
    return '''<figure class="nature-scene scale-scene" data-nature-scene data-scale-scene data-motion="static">
  <button class="scale-trigger" type="button" data-scale-replay aria-label="Gerakkan timbangan Nalar Hakim" aria-disabled="true">
  ''' + artwork + '''
  </button>
</figure>'''
