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
          <button class="favorite-button" data-item-id="${item.id}">❤️</button>
        </li>
      `);
      $itemsList.append($item);
    }

    // Add event listener for favoriting an item
    $('.favorite-button').on('click', function() {
      const itemId = $(this).data('item-id');
      $.ajax({
        method: 'POST',
        url: `/api/items/${itemId}/favorite`
      })
      .done((response) => {
        alert('Item favorited!');
      });
    });
  });
});
