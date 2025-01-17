// Client facing scripts here

$(document).ready(function() {
  let isSubmenuVisible = false; // Track submenu visibility

  // Add event listener for menu icon on mobile
  $('.fa-solid.fa-bars').on('click', function () {
    // Toggle submenu visibility on click (only for mobile view)
    if ($(window).width() <= 960) {
      if (isSubmenuVisible) {
        $('.menuItems').fadeOut(); // Hide submenu
      } else {
        $('.menuItems').fadeIn(); // Show submenu
      }
      isSubmenuVisible = !isSubmenuVisible; // Toggle state
    }
  });

  // Close menu if click is outside the menu
  $(document).on('click', function (e) {
    if (!$(e.target).closest('.fa-bars, .menuItems').length) {
      $('.menuItems').fadeOut();
      isSubmenuVisible = false;
    }
  });

  // Handle screen resizing to reset menu behavior for mobile or desktop
  $(window).on('resize', function() {
    if ($(window).width() > 960) { // Desktop view
      // Ensure menu is visible on desktop
      $('.menuItems').show();
      isSubmenuVisible = true; // Reset to ensure no conflicts with mobile toggle
    } else { // Mobile view
      // Ensure menu is hidden on mobile
      $('.menuItems').hide();
      isSubmenuVisible = false; // Reset to prevent conflicts
    }
  }).trigger('resize'); // Trigger resize on initial load to set the correct state
});
