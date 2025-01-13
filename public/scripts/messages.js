// Client facing scripts here
$(document).ready(() => {

  $('#message-form').on('submit', (event) => {
    event.preventDefault();

    const messageContent = $('#message-content').val();

    $.ajax({
      method: 'POST',
      url: '/messages-api',
      data: { content: messageContent }
    })

      .done((response) => {
        alert('Message sent successfully!');
        $('#message-content').val('');
      })

      .fail((error) => {
        alert('Failed to send message.');
        console.error(error);
      })
 
  
  });
});
