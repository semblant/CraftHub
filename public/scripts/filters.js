$(() => {
  const fetchItems = (url) => {
    $.ajax({
      method: 'GET',
      url: url
    })
    .done((response) => {
      const $itemsList = $('.product-listings');
      $itemsList.empty();

      for (const item of response.items) {
        const $item = $(`
          <div class="product">
            <div class="product-header">
              <span class="product-title">${item.title}</span>
              <span class="product-price">$${item.price}</span>
            </div>
            <img src="${item.image_url}" alt="${item.title}">
            <div class="product-footer">
              <span class="user-name">${item.username}</span>
              <button class="chat-button">💬</button>
            </div>
            <i class="favorite-icon">❤️</i>
          </div>
        `);
        $itemsList.append($item);
      }
    });
  };

  // Filter items by price
  $('.filter-button-price').click(() => {
    const minPrice = prompt("Enter minimum price:");
    const maxPrice = prompt("Enter maximum price:");
    fetchItems(`/api/items/filter/price?minPrice=${minPrice}&maxPrice=${maxPrice}`);
  });

  // Filter favorited items
  $('.filter-button-favorites').click(() => {
    fetchItems('/api/items/favorites');
  });
});
