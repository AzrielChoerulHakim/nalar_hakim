"""Navigation icon rendering must not rewrite prose, data or link semantics."""
import unittest
from icons import ARROWS, arrow_icon, render_navigation_icons


class NavigationIconTest(unittest.TestCase):
    def test_all_directions_are_decorative_svg(self):
        for character, (direction, _) in ARROWS.items():
            with self.subTest(character=character):
                result = render_navigation_icons(f'<a href="/">Baca {character}</a>')
                self.assertIn(f'class="nh-icon nh-icon-{direction}"', result)
                self.assertIn('aria-hidden="true" focusable="false"', result)
                self.assertNotIn(character, result)
                self.assertNotIn('<title>', result)

    def test_preserves_attributes_json_and_prose_exactly(self):
        original = '''<!doctype html>
<script type="application/ld+json">{"headline":"Norma → Akibat"}</script>
<script>const label = "Baca ↗";</script><style>.arrow::after {content:"↗"}</style>
<h2><a href="/" title="A → B" aria-label="Baca A → B">A → B</a></h2>
<div class="article-content"><p>A → B <a href="/">konsekuensi → tanggung jawab</a></p>
<blockquote>Pilihan ↗</blockquote><aside class="article-summary"><p>Argumen → hasil</p></aside></div>
<code>foo → bar</code><pre>↑ ↓</pre><svg><text>↗</text></svg><!-- ↗ -->'''
        self.assertEqual(render_navigation_icons(original), original)

    def test_references_back_links_and_labels(self):
        source = ('<a class="back-link" href="/" aria-label="Kembali ←">← Kembali</a>'
                  '<span class="eyebrow">BACAAN PILIHAN ↘</span>'
                  '<div class="article-content"><section class="article-references">'
                  '<a href="/">Judul → akibat <span aria-hidden="true">↗</span></a>'
                  '<a class="reference-return" href="#ref">Kembali ↑</a></section></div>')
        result = render_navigation_icons(source)
        self.assertEqual(result.count('<svg '), 4)
        self.assertIn('aria-label="Kembali ←"', result)
        self.assertIn('Judul → akibat', result)

    def test_idempotent_and_preserves_original_markup(self):
        source = '<a data-label=\'x > y\' href="/">Baca &amp; telaah <span aria-hidden="true">↗</span></a>\n'
        result = render_navigation_icons(source)
        self.assertEqual(result, source.replace('↗', arrow_icon('↗')))
        self.assertEqual(render_navigation_icons(result), result)


if __name__ == '__main__':
    unittest.main()
