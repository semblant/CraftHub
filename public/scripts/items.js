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
            <i class="favorite-icon fa-solid fa-heart" data-item-id="${item.id}" style="color: #ff0000;"></i>
          </li>
        `);
        $itemsList.append($item);
      }
    })
    .fail(() => {
      alert('Failed to fetch items. Please try again later.');
    });
});
