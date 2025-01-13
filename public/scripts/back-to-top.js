$(() => {
  // Show back-to-top button on scroll
  $(window).scroll(() => {
    if ($(window).scrollTop() > 100) {
      $('.back-to-top').fadeIn();
    } else {
      $('.back-to-top').fadeOut();
    }
  });

  // Scroll to top on back-to-top button click
  $('.back-to-top').click(() => {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  });
});
