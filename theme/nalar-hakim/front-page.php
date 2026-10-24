<?php
if (!defined('ABSPATH')) { exit; }
get_header();
$featured = new WP_Query(array('post_type' => 'post', 'post_status' => 'publish', 'posts_per_page' => 4, 'ignore_sticky_posts' => true, 'no_found_rows' => true));
$featured_ids = wp_list_pluck($featured->posts, 'ID');
?>
<main id="main-content" class="container home-main">
<div class="home-intro"><div><span class="eyebrow">HUKUM, DARI BERBAGAI SUDUT.</span><h1>Ruang untuk<br><span>menimbang.</span></h1></div><p>Peristiwa hari ini. Gagasan lintas zaman. <br>Membaca hukum dengan nalar yang terbuka.</p></div>
<?php if ($featured->have_posts()) : ?>
<div class="section-heading"><h2>Sorotan</h2><span class="eyebrow">CATATAN LAZARUS <span aria-hidden="true">↘</span></span></div>
<div class="hero-grid">
<?php $featured->the_post(); ?>
<article class="lead-story"><a class="story-image" href="<?php the_permalink(); ?>" aria-label="<?php echo esc_attr(get_the_title()); ?>"><?php nh_cover('nh-cover', true); ?></a><div class="story-body"><?php nh_meta(); ?><h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2><p><?php echo esc_html(wp_trim_words(get_the_excerpt(), 32)); ?></p><a class="read-link" href="<?php the_permalink(); ?>">Baca selengkapnya <span aria-hidden="true">↗</span></a></div></article>
<aside class="top-stories" aria-label="Tulisan pilihan"><div class="section-heading"><h2>Juga untuk dibaca</h2></div><?php while ($featured->have_posts()) : $featured->the_post(); ?><article class="rail-story"><?php nh_meta(); ?><h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3><span class="rail-arrow" aria-hidden="true">↗</span></article><?php endwhile; ?><div class="rail-note"><span class="eyebrow">CATATAN REDAKSI</span><p>Setiap persoalan layak dibaca dari lebih dari satu sudut.</p><span>Lazarus / Nalar Hakim</span></div></aside>
</div>
<?php wp_reset_postdata(); ?>
<?php $latest = new WP_Query(array('post_type' => 'post', 'post_status' => 'publish', 'posts_per_page' => 6, 'post__not_in' => $featured_ids, 'ignore_sticky_posts' => true, 'no_found_rows' => true)); if ($latest->have_posts()) : ?>
<section class="latest-section" aria-labelledby="latest-title"><div class="section-heading"><h2 id="latest-title">Catatan terbaru</h2><a class="text-link" href="<?php echo esc_url(add_query_arg('s', '', home_url('/'))); ?>">Cari artikel ↗</a></div><div class="article-grid"><?php while ($latest->have_posts()) : $latest->the_post(); get_template_part('template-parts/card'); endwhile; ?></div></section>
<?php endif; wp_reset_postdata(); ?>
<?php else : ?>
<section class="empty-state"><span class="eyebrow">SEBUAH RUANG BARU</span><h2>Gagasan pertama<br>sedang dipersiapkan.</h2><p>Nalar Hakim adalah ruang membaca peristiwa dan menimbang hukum. Tulisan Lazarus akan hadir di sini.</p><a class="read-link" href="mailto:nalar.hakim77@gmail.com">Hubungi redaksi ↗</a></section>
<?php endif; ?>
<section class="channel-section" aria-labelledby="channel-title"><div class="section-heading"><h2 id="channel-title">Lima sudut pandang</h2><span class="eyebrow">JELAJAHI KANAL</span></div><div class="channel-grid"><?php $i=0; foreach (nh_channels() as $slug=>$label) : $i++; ?><a class="channel-card" href="<?php echo esc_url(nh_channel_url($slug)); ?>"><span class="channel-number"><?php echo esc_html(sprintf('%02d', $i)); ?></span><h3><?php echo esc_html($label); ?></h3><span aria-hidden="true">↗</span></a><?php endforeach; ?></div></section>
</main><?php get_footer(); ?>
