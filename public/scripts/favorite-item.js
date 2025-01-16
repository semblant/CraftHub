/* eslint-disable */

// Function to toggle the favorite status of an item
async function toggleFavorite(itemId) {
  try {
    // Send a POST request to the server to toggle the favorite status
    const response = await fetch(`/api/items/${itemId}/favorite`, {
      method: 'POST',
      credentials: 'same-origin'
    });
    // Parse the JSON response from the server
    const data = await response.json();
    if (response.ok) {
      // Select the heart icon element associated with the item
      const heartIcon = document.querySelector(`.favorite-icon[data-item-id="${itemId}"]`);
      // Check if the item is currently favorited
      const isFavorited = heartIcon.style.color === 'red';
      // Toggle the heart icon color
      heartIcon.style.color = isFavorited ? '#414141' : 'red';
      // Show an alert message indicating the new favorite status
      alert(isFavorited ? 'Product Unfavorited' : 'Product Favorited');
    } else {
      // Show an alert message if the request failed
      alert(data.error || 'Failed to toggle favorite');
    }
  } catch (error) {
    // Log any errors that occur during the request
    console.error('Error toggling favorite:', error);
  }
}

// Attach the event listener to all favorite icons
$(document).on('click', '.favorite-icon', function () {
  // Get the item ID from the clicked element
  const itemId = $(this).data('item-id');
  // Call the toggleFavorite function with the item ID
  toggleFavorite(itemId);
});

/* eslint-enable */
