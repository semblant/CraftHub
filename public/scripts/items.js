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
});
