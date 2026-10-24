<?php if (!defined('ABSPATH')) { exit; } ?>
<footer class="site-footer"><div class="container">
<div class="footer-top"><div><a class="footer-brand" href="<?php echo esc_url(home_url('/')); ?>">NALAR HAKIM<span class="brand-dot">.</span></a><p>Membaca peristiwa.<br>Menimbang hukum.</p></div><div class="footer-contact"><span class="eyebrow">RUANG UNTUK BERDIALOG</span><a href="mailto:nalar.hakim77@gmail.com">nalar.hakim77@gmail.com <span aria-hidden="true">↗</span></a><p>Catatan, masukan, dan koreksi selalu terbuka.</p></div></div>
<?php if (!is_single()) { get_template_part('template-parts/donation'); } ?>
<div class="footer-bottom"><span>© <?php echo esc_html(wp_date('Y')); ?> Nalar Hakim</span><span>Ditulis oleh Lazarus.</span><a href="#main-content">Kembali ke atas ↑</a></div>
</div></footer><?php wp_footer(); ?></body></html>
