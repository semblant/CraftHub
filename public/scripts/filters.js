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
              <a class="product-title" href="/detailed-item/${item.id}">${item.title}</a>
              <span class="product-price">$${item.price}</span>
            </div>
            <img src="${item.image_url}" alt="${item.title}">
            <div class="product-footer">
              <button class="chat-button">💬</button>
            </div>
            <i class="favorite-icon fa-solid fa-heart" data-item-id="${item.id}" style="color: ${item.is_favorited ? 'red' : '#414141'};"></i>
          </div>
        `);
          $itemsList.append($item);
        }
      })
      .fail(() => {
        alert('Failed to fetch items. Please try again later.');
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
