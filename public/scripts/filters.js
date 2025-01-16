$(() => {
  let isPriceFilterActive = false;
  let isFavoritesFilterActive = false;
  let lastMinPrice = null;
  let lastMaxPrice = null;

  // Function to fetch items from the server and update the DOM
  const fetchItems = (url) => {
    $.ajax({
      method: 'GET',
      url: url
    })
      .done((response) => {
        const $itemsList = $('.product-listings');
        $itemsList.empty();

        // Iterate through the items and append them to the DOM
        for (const item of response.items) {
          const $item = $(`
          <div class="product">
            <div class="product-header">
              <a class="product-title" href="/detailed-item/${item.id}">${item.title}</a>
              <span class="product-price">$${item.price}</span>
            </div>
            <img src="${item.image_url}" alt="${item.title}">
            <div class="product-footer">
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
    if (isPriceFilterActive) {
      // If the price filter is active, fetch all items
      fetchItems('/api/items');
      isPriceFilterActive = false;
    } else {
      // Prompt the user for min and max price if not already set
      if (lastMinPrice === null || lastMaxPrice === null) {
        lastMinPrice = prompt("Enter minimum price:");
        lastMaxPrice = prompt("Enter maximum price:");
      }
      // Fetch items within the specified price range
      if (lastMinPrice !== null && lastMaxPrice !== null) {
        fetchItems(`/api/items/filter/price?minPrice=${lastMinPrice}&maxPrice=${lastMaxPrice}`);
        isPriceFilterActive = true;
        isFavoritesFilterActive = false; // Reset other filter
      }
    }
  });

  // Filter favorited items
  $('.filter-button-favorites').click(() => {
    if (isFavoritesFilterActive) {
      // If the favorites filter is active, fetch all items
      fetchItems('/api/items');
      isFavoritesFilterActive = false;
    } else {
      // Fetch only favorited items
      fetchItems('/api/items/favorites');
      isFavoritesFilterActive = true;
      isPriceFilterActive = false; // Reset other filter
    }
  });

  fetchItems('/api/items'); // Initial fetch to load all items
});
