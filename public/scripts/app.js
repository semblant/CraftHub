// Client facing scripts here


$(document).ready(function() {
  console.log('jQuery is working!')
  let isSubmenuVisible = false; // Track submenu visibility
  // Add event listener for menu item on mobile
  $('.fa-solid.fa-bars').on('click', function () {
    console.log('Menu item was clicked!')

    if (isSubmenuVisible) {
      $('.menuItems').fadeOut(); // Hide submenu
    } else {
      $('.menuItems').fadeIn(); // Show submenu
    }
    isSubmenuVisible = !isSubmenuVisible; // Toggle state
  });

  // Close menu if click is outside the menu
  $(document).on('click', function (e) {
    console.log('Clicked outside:', e.target);
    if (!$(e.target).closest('.fa-bars, .menuItems').length) {
      $('.menuItems').fadeOut();
      isSubmenuVisible = false;
    }
  });
});
