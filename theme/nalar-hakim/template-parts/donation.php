<?php
if (!defined('ABSPATH')) { exit; }
$nh_wallet = '0x39fbbC339D69ae2F8B671f7fE1D356086137e2bE';
$nh_donation_networks = array('Ethereum Mainnet' => 'ETH · Ethereum Mainnet', 'BSC' => 'BSC', 'Robinhood' => 'Robinhood');
?>
<details class="donation"><summary><span><span class="eyebrow">TETAP TERBUKA UNTUK SEMUA</span><span class="donation-title">Dukung Nalar Hakim</span></span></summary>
<div class="donation-content donation-addresses"><p>Jika ingin membantu biaya pengelolaan Nalar Hakim, Anda dapat memberi dukungan sukarela melalui alamat berikut.</p>
<div class="donation-networks">
<?php foreach ($nh_donation_networks as $nh_network => $nh_label) : ?>
<section class="donation-network" aria-label="<?php echo esc_attr('Donasi melalui ' . $nh_network); ?>">
<h3 class="network-label"><?php echo esc_html($nh_label); ?></h3>
<code class="wallet-address"><?php echo esc_html($nh_wallet); ?></code>
<button class="copy-button" type="button" data-copy-address="<?php echo esc_attr($nh_wallet); ?>" data-copy-network="<?php echo esc_attr($nh_network); ?>" aria-label="<?php echo esc_attr('Salin alamat ' . $nh_network); ?>" hidden>Salin alamat</button>
<span data-copy-status role="status" aria-live="polite"></span>
</section>
<?php endforeach; ?>
</div><p class="donation-note">Donasi sukarela. Semua tulisan tetap bebas dibaca.</p></div></details>
