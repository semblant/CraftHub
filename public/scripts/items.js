$(() => {
  $.ajax({
    method: 'GET',
    url: '/api/items'
  })
  .done((response) => {
    const $itemsList = $('#items');
    $itemsList.empty();

    for (const item of response.items) {
      const $item = $(`
        <li class="item">
          <h2>${item.title}</h2>
          <p>${item.description}</p>
          <p>Price: $${item.price}</p>
          <img src="${item.image_url}" alt="${item.title}">
        </li>
      `);
      $itemsList.append($item);
    }
  });

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
