
<?php
if ( is_user_logged_in() ) {
?>
	<div class="site-header-right-link">
		<a href="<?php echo get_permalink( get_option('woocommerce_myaccount_page_id') ); ?>" class="my-account" title="<?php esc_attr_e('My Account','panoramic'); ?>"><?php esc_attr_e('My Account','panoramic'); ?></a>
	</div>
<?php
} else {
?>
	<div class="site-header-right-link">
		<a href="<?php echo get_permalink( get_option('woocommerce_myaccount_page_id') ); ?>" class="my-account" title="<?php esc_attr_e('Login','panoramic'); ?>"><?php esc_attr_e('Sign In / Register','panoramic'); ?></a>
	</div>
<?php
}
?>

<div class="header-cart">
	<a class="header-cart-contents" href="<?php echo esc_url( wc_get_cart_url() ); ?>" title="<?php esc_attr_e('View your shopping cart', 'panoramic'); ?>">
		<span class="header-cart-amount">
			<?php echo sprintf(_n('%d item', '%d items', WC()->cart->get_cart_contents_count(), 'panoramic'), WC()->cart->get_cart_contents_count());?> - <?php echo wp_kses_data( WC()->cart->get_cart_subtotal() ); ?>
		</span>
		<span class="header-cart-checkout <?php echo ( WC()->cart->get_cart_contents_count() > 0 ) ? 'cart-has-items' : ''; ?>">
			<span><?php esc_attr_e('Checkout', 'panoramic'); ?></span> <i class="otb-fa otb-fa-shopping-cart"></i>
		</span>
	</a>
</div>
