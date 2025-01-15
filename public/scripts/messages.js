// Client facing scripts here
$(document).ready(() => {
  console.log('Hello');

  $.ajax({
    method: 'GET',
    url: '/api/messages'
  })
    .done((response) => {
      const messageHtml = `
      <div class="message-sent">
        <p>${response.content}</p>
        <span class="timestamp">${new Date(response.timestamp).toLocaleTimeString()}</span>
      </div>
      `;
      $('.active-messages').append(messageHtml);

      // modify code above to fit messages.ejs - check
      // make sure messages are able to be displayed upon page refresh
    });

    
  $('#message-form').on('submit', (event) => {
    event.preventDefault();

    const messageContent = $('#message-content').val();

    $.ajax({
      method: 'POST',
      url: '/api/messages',
      data: { content: messageContent }
    })

      .done((response) => {
        const messageHtml = `
        <div class="message-sent">
          <p>${response.content}</p>
          <span class="timestamp">${new Date(response.timestamp).toLocaleTimeString()}</span>
        </div>
        `;
        $('.active-messages').append(messageHtml);
        $('#message-content').val('');
      })

      .fail((error) => {
        alert('Failed to send message.');
        console.error(error);
      })

  });

});


