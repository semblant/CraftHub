// Client facing scripts here


$(document).ready(function() {
  let isSubmenuVisible = false; // Track submenu visibility
  // Add event listener for menu item on mobile
  $('.fa-solid.fa-bars').on('click', function () {

    if (isSubmenuVisible) {
      $('.menuItems').fadeOut(); // Hide submenu
    } else {
      $('.menuItems').fadeIn(); // Show submenu
    }
    isSubmenuVisible = !isSubmenuVisible; // Toggle state
  });

  // Close menu if click is outside the menu
  $(document).on('click', function (e) {
    // If user clicks outside of the menu on mobile, the menu closes
    if (!$(e.target).closest('.fa-bars, .menuItems').length && visualViewport < 961) {
      $('.menuItems').fadeOut();
      isSubmenuVisible = false;
    }
  });
});
