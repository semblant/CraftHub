async function toggleFavorite(itemId) {
  try {
    const response = await fetch(`/api/items/${itemId}/favorite`, {
      method: 'POST',
      credentials: 'same-origin' // Ensures cookies are sent with the request
    });
    const data = await response.json();
    if (response.ok) {
      const heartIcon = document.querySelector(`.favorite-icon[data-item-id="${itemId}"]`);
      const isFavorited = heartIcon.style.color === 'red';
      heartIcon.style.color = isFavorited ? '#414141' : 'red'; // Toggle between red and gray/black
      alert(isFavorited ? 'Product Unfavorited' : 'Product Favorited'); // Alternate message
    } else {
      alert(data.error || 'Failed to toggle favorite');
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
  }
}

// Attach the event listener to all favorite icons
$(document).on('click', '.favorite-icon', function () {
  const itemId = $(this).data('item-id');
  toggleFavorite(itemId);
});
