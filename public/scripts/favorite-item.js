async function toggleFavorite(itemId) {
  try {
    const response = await fetch(`/api/items/${itemId}/favorite`, {
      method: 'POST',
      credentials: 'same-origin' // Ensures cookies are sent with the request
    });
    const data = await response.json();
    console.log(data); // Debugging the response
    if (response.ok) {
      alert(data.message);
      const heartIcon = document.querySelector(`.favorite-icon[data-item-id="${itemId}"]`);
      heartIcon.style.color = heartIcon.style.color === 'red' ? 'black' : 'red';
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
