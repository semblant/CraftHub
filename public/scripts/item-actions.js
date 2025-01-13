// Client facing scripts here

$(document).ready(function() {
  // Event listener for user clicking 'Remove Item' button
  $('input.removeItem').on('click', function() {
    console.log('u want to remove????')
    let deleteMenu = false;
    $('.deleteConfirmMenu').fadeIn();
    deleteMenu = true;
    // Event Listener for 'no'
    $('deleteNo').on('click', () => {
      $('.deleteConfirmMenu').fadeOut();

    });


  });
});
