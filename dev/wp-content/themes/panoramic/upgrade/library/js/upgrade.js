/**
 * Panoramic Custom JS Functionality
 *
 */
( function( $ ) {
    
    $( document ).ready( function() {
    });
    
    $(window).on('load', function() {
        panoramic_init_testimonials_slider();
    });
    
    // Testimonials Slider
    function panoramic_init_testimonials_slider() {
        $( '.testimonials' ).carouFredSel({
            responsive: true,
            circular: true,
            infinite: false,
            width: 280,
            height: 'variable',
            items: {
                visible: 1,
                start: 0,
                width: 280,
                height: 'variable'
            },
            onCreate: function(items) {
                $( '.testimonials-container' ).removeClass( 'loading' );
            },
            scroll: {
                fx: 'crossfade',
                duration: 450
            },
            auto: 10000,
            prev: '.testimonials-container .prev',
            next: '.testimonials-container .next'
        });
    }
    
} )( jQuery );
