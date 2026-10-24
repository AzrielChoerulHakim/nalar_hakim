<?php if (!defined('ABSPATH')) { exit; } ?><!doctype html>
<html <?php language_attributes(); ?>>
<head><meta charset="<?php bloginfo('charset'); ?>"><meta name="viewport" content="width=device-width, initial-scale=1"><?php wp_head(); ?></head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link" href="#main-content">Langsung ke konten</a>
<header class="site-header">
<div class="container header-inner">
<a class="brand" href="<?php echo esc_url(home_url('/')); ?>" aria-label="Nalar Hakim, beranda"><span class="brand-mark" aria-hidden="true">n<span>h</span></span><span><span class="brand-name">NALAR HAKIM<span class="brand-dot">.</span></span><span class="brand-caption">MEDIA HUKUM &amp; GAGASAN</span></span></a>
<div class="header-actions"><span class="header-note">INDEPENDEN DALAM BERPIKIR.</span><button class="theme-toggle" data-theme-toggle type="button" aria-label="Ganti tema terang atau gelap" hidden>◐</button><details class="header-search"><summary aria-label="Buka pencarian">Cari <span aria-hidden="true">↗</span></summary><?php get_search_form(); ?></details></div>
</div>
<nav class="channel-nav" aria-label="Kanal hukum"><div class="container"><a href="<?php echo esc_url(home_url('/')); ?>"<?php if (is_front_page()) { echo ' aria-current="page"'; } ?>>Semua</a><?php foreach (nh_channels() as $slug => $label) : ?><a href="<?php echo esc_url(nh_channel_url($slug)); ?>"<?php if (is_category($slug)) { echo ' aria-current="page"'; } ?>><?php echo esc_html($label); ?></a><?php endforeach; ?></div></nav>
</header>
