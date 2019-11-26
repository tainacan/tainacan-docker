( function( $ ) {
	"use strict";

	$( document ).on( 'click', '.grids-notice .notice-dismiss', function () {
		var notice = $( this ).parents( '.notice' ).first(),
			key = notice.attr( 'data-key' ),
			nonce = notice.attr( 'data-nonce' );

		$.ajax( ajaxurl, {
			type: 'POST',
			data: {
				action: 'grids_' + key + '_dismiss',
				nonce: nonce
			}
		} );
	} );

} )( jQuery );
