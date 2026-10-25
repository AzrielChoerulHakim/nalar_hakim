<?php
/** Theme foundation for a critical legal publication edited by Lazarus. */
if (!defined('ABSPATH')) { exit; }

function nh_channels() {
    return array('pidana' => 'Pidana', 'perdata' => 'Perdata', 'agama-keluarga' => 'Agama & Keluarga', 'filsafat-hukum' => 'Filsafat Hukum', 'hukum-teknologi' => 'Hukum & Teknologi');
}
function nh_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('automatic-feed-links');
    add_theme_support('responsive-embeds');
    add_theme_support('html5', array('search-form', 'gallery', 'caption', 'style', 'script'));
    add_theme_support('editor-styles');
    add_editor_style('style.css');
    add_image_size('nh-cover', 1100, 660, true);
    add_image_size('nh-card', 600, 360, true);
}
add_action('after_setup_theme', 'nh_setup');
function nh_activate() {
    foreach (nh_channels() as $slug => $name) {
        if (!term_exists($slug, 'category')) { wp_insert_term($name, 'category', array('slug' => $slug)); }
    }
}
add_action('after_switch_theme', 'nh_activate');
function nh_assets() {
    $version = wp_get_theme()->get('Version');
    wp_enqueue_style('nalar-hakim', get_stylesheet_uri(), array(), $version);
    wp_enqueue_script('nalar-hakim', get_theme_file_uri('assets/site.js'), array(), $version, array('strategy' => 'defer', 'in_footer' => true));
}
add_action('wp_enqueue_scripts', 'nh_assets');
function nh_channel_url($slug) {
    $term = get_category_by_slug($slug);
    if ($term) {
        $url = get_category_link($term->term_id);
        if (!is_wp_error($url)) { return $url; }
    }
    return add_query_arg('category_name', $slug, home_url('/'));
}
function nh_editorial_pages() {
    static $links = null;
    if (null !== $links) { return $links; }
    $links = array();
    foreach (array('kirim-naskah' => 'Kirim Naskah', 'tentang' => 'Tentang', 'kebijakan-redaksi' => 'Kebijakan Redaksi') as $slug => $label) {
        $page = get_page_by_path($slug, OBJECT, 'page');
        if (!$page || 'publish' !== $page->post_status || $page->post_password) { continue; }
        $url = get_permalink($page);
        if ($url) { $links[] = array('id' => $page->ID, 'label' => $label, 'url' => $url); }
    }
    return $links;
}
function nh_editorial_links() {
    foreach (nh_editorial_pages() as $link) {
        echo '<a href="' . esc_url($link['url']) . '"' . (is_page($link['id']) ? ' aria-current="page"' : '') . '>' . esc_html($link['label']) . '</a> ';
    }
}
// Public attribution belongs to the article, not the WordPress account that uploads it.
function nh_author_alias($post_id = 0) {
    $alias = get_post_meta($post_id ?: get_the_ID(), '_nh_author_alias', true);
    $alias = is_string($alias) ? trim(sanitize_text_field($alias)) : '';
    return '' !== $alias ? $alias : 'Lazarus';
}
function nh_author_alias_box($post) {
    $alias = get_post_meta($post->ID, '_nh_author_alias', true);
    wp_nonce_field('nh_save_author_alias_' . $post->ID, 'nh_author_alias_nonce');
    echo '<p><label for="nh-author-alias">Nama samaran penulis</label></p>';
    echo '<input type="text" class="widefat" id="nh-author-alias" name="nh_author_alias" value="' . esc_attr(is_string($alias) ? $alias : '') . '" aria-describedby="nh-author-alias-help">';
    echo '<p id="nh-author-alias-help">Isi nama samaran yang disepakati dengan penulis. Kosong berarti Lazarus; gunakan nilai bawaan hanya untuk tulisan Lazarus. Nama akun WordPress tidak dipakai sebagai byline.</p>';
}
add_action('add_meta_boxes_post', function () {
    add_meta_box('nh-public-author', 'Nama penulis publik', 'nh_author_alias_box', 'post', 'side');
});
function nh_save_author_alias($post_id) {
    if ((defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) || wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) { return; }
    if (!current_user_can('edit_post', $post_id)) { return; }
    if (!isset($_POST['nh_author_alias_nonce'], $_POST['nh_author_alias']) || !is_string($_POST['nh_author_alias_nonce']) || !is_string($_POST['nh_author_alias'])) { return; }
    if (!wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['nh_author_alias_nonce'])), 'nh_save_author_alias_' . $post_id)) { return; }
    $alias = trim(sanitize_text_field(wp_unslash($_POST['nh_author_alias'])));
    if ('' === $alias) { delete_post_meta($post_id, '_nh_author_alias'); }
    else { update_post_meta($post_id, '_nh_author_alias', wp_slash($alias)); }
}
add_action('save_post_post', 'nh_save_author_alias');
function nh_post_channel() {
    $categories = get_the_category();
    foreach ($categories as $category) {
        if (array_key_exists($category->slug, nh_channels())) { return $category; }
    }
    return $categories ? $categories[0] : null;
}
function nh_read_minutes() {
    $text = wp_strip_all_tags(strip_shortcodes(get_post_field('post_content', get_the_ID())));
    $words = preg_split('/\s+/u', trim($text), -1, PREG_SPLIT_NO_EMPTY);
    return max(1, (int) ceil(count($words ?: array()) / 200));
}
function nh_meta() {
    $category = nh_post_channel();
    echo '<div class="story-meta">';
    if ($category) { echo '<a class="category-label" href="' . esc_url(get_category_link($category)) . '">' . esc_html($category->name) . '</a>'; }
    echo '<time datetime="' . esc_attr(get_the_date(DATE_W3C)) . '">' . esc_html(get_the_date('j M Y')) . '</time>';
    echo '<span>' . esc_html(nh_read_minutes()) . ' menit baca</span></div>';
}
function nh_cover($size = 'nh-card', $priority = false) {
    if (has_post_thumbnail()) {
        $attr = array('class' => 'cover-image', 'loading' => $priority ? 'eager' : 'lazy', 'decoding' => 'async');
        if ($priority) { $attr['fetchpriority'] = 'high'; }
        the_post_thumbnail($size, $attr);
    } else {
        echo '<span class="cover-placeholder" aria-hidden="true"><span class="cover-orbit"></span><span class="cover-monogram">NH</span><span class="cover-caption">NALAR HAKIM / KRITIK HUKUM</span></span>';
    }
}
function nh_public_name($name) { return is_admin() ? $name : nh_author_alias(); }
add_filter('the_author', 'nh_public_name');
add_filter('get_the_author_display_name', 'nh_public_name');
add_filter('get_the_author_user_url', function ($value) { return is_admin() ? $value : home_url('/'); });
foreach (array('user_email', 'first_name', 'last_name', 'description', 'user_login', 'user_nicename') as $nh_private_field) {
    add_filter('get_the_author_' . $nh_private_field, function ($value) { return is_admin() ? $value : ''; });
}
// No public avatar requests (including Gravatar email hashes).
add_filter('get_avatar', function ($html) { return is_admin() ? $html : ''; });
add_filter('author_link', function ($url) { return is_admin() ? $url : home_url('/'); });
add_filter('oembed_response_data', function ($data, $post) {
    $data['author_name'] = nh_author_alias($post->ID);
    $data['author_url'] = home_url('/');
    return $data;
}, 10, 2);
add_filter('wp_sitemaps_add_provider', function ($provider, $name) { return 'users' === $name ? false : $provider; }, 10, 2);
add_action('template_redirect', function () {
    if (is_author()) {
        global $wp_query;
        $wp_query->set_404();
        status_header(404);
        nocache_headers();
        remove_action('template_redirect', 'redirect_canonical');
    }
}, 0);
add_filter('rest_pre_dispatch', function ($result, $server, $request) {
    if (!current_user_can('edit_posts') && preg_match('#^/wp/v2/users(?:/|$)#i', $request->get_route())) {
        return new WP_Error('nh_private_author', 'Profil akun tidak tersedia untuk publik.', array('status' => 403));
    }
    return $result;
}, 10, 3);
// Defense in depth for user objects prepared through an alternative REST route.
add_filter('rest_prepare_user', function ($response) {
    if (!current_user_can('edit_posts')) {
        $data = $response->get_data();
        foreach (array('name' => 'Lazarus', 'slug' => 'lazarus', 'link' => home_url('/'), 'url' => home_url('/'), 'description' => '', 'avatar_urls' => array()) as $key => $value) {
            if (array_key_exists($key, $data)) { $data[$key] = $value; }
        }
        unset($data['username'], $data['first_name'], $data['last_name'], $data['email']);
        $response->set_data($data);
    }
    return $response;
});
function nh_public_rest_post($response) {
    if (!current_user_can('edit_posts')) {
        $data = $response->get_data();
        unset($data['author']);
        $response->set_data($data);
        $response->remove_link('author');
    }
    return $response;
}
add_filter('rest_prepare_post', 'nh_public_rest_post');
add_filter('rest_prepare_page', 'nh_public_rest_post');
add_filter('rest_prepare_attachment', 'nh_public_rest_post');
add_filter('body_class', function ($classes) { return array_values(array_filter($classes, function ($c) { return 0 !== strpos($c, 'author-'); })); });
// Anonymous users search published posts only; normal WordPress permissions remain intact.
add_action('pre_get_posts', function ($query) {
    if (!is_admin() && $query->is_main_query() && $query->is_search()) { $query->set('post_type', 'post'); }
});
