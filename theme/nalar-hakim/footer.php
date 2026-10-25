<?php if (!defined('ABSPATH')) { exit; } ?>
<footer class="site-footer"><div class="container">
<div class="footer-top"><div><a class="footer-brand" href="<?php echo esc_url(home_url('/')); ?>">NALAR HAKIM<span class="brand-dot">.</span></a><p>Menguji aturan.<br>Menimbang keadilan.</p></div><div class="footer-contact"><span class="eyebrow">MEJA REDAKSI / LAZARUS</span><a href="mailto:nalar.hakim77@gmail.com">nalar.hakim77@gmail.com <span aria-hidden="true">↗</span></a><p>Kirim naskah Word dengan nama samaran atau laporkan kekeliruan faktual melalui email. Lazarus meninjau naskah sebelum terbit.</p><?php if (nh_editorial_pages()) : ?><nav aria-label="Redaksi"><?php nh_editorial_links(); ?></nav><?php endif; ?></div></div>
<?php if (!is_single()) { get_template_part('template-parts/donation'); } ?>
<div class="footer-bottom"><span>© <?php echo esc_html(wp_date('Y')); ?> Nalar Hakim</span><span>Editor: Lazarus.</span><a href="#main-content">Kembali ke atas ↑</a></div>
</div></footer><?php wp_footer(); ?></body></html>
