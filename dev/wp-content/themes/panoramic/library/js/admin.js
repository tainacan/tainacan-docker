/**
 * Panoramic Theme Custom Admin Functionality
 *
 */
( function( $ ) {
	
	$(window).load(function() {
		$( '.e-dashboard-widget .e-overview__go-pro a' ).attr( 'href', 'https://www.outtheboxthemes.com/go/elementor/' );
		$( '#adminmenu #toplevel_page_elementor a[href="admin.php?page=go_elementor_pro"], a.elementor-plugins-gopro' ).attr( 'href', 'https://www.outtheboxthemes.com/go/elementor/' ).attr( 'target', '_blank' );''
		$( '.elementor-button.elementor-button-default.elementor-button-go-pro' ).attr( 'href', 'https://www.outtheboxthemes.com/go/elementor/' );
    });

	$( document ).ready( function() {
		// Open the RSS dashboard widget links in a new tab
		$( '#otb-dashboard-news a.rsswidget' ).click(function() {
			$(this).attr( 'target', '_blank' );
		});
	});

} )( jQuery );
