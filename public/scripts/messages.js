// Client facing scripts here

// Function to fetch all saved messages within the database and load them to the chat window
const fetchMessages = function () {
  $.ajax({
    method: 'GET',
    url: '/api/messages'
  })
    .done((response) => {

      $('.active-messages').empty();

      const messages = response.messages;
      const senderId = response.senderId;

      for (let message of messages) {

        const messageHtml = `
          <div class="${senderId === message.sender_id ? "message-sent" : "message-received"}">
            <p>${message.content}</p>
            <span class="timestamp">${new Date(message.timestamp).toLocaleTimeString()}</span>
          </div>
          `;
        $('.active-messages').append(messageHtml);

      }

      })
};

$(document).ready(() => {

  fetchMessages();

  // Reload messages every five seconds
  setInterval(fetchMessages, 5000);

  // Get request for sidebar display
  $.ajax({
    url: '/api/messages/availableChat',
    method: 'GET',
    success: (response) => {

      const maxMessageLength = 35;

      const { otherUserId, lastMessage, timestamp } = response;
      const truncatedMessage = lastMessage.length > maxMessageLength
      ? lastMessage.substring(0, maxMessageLength) + '...'
      : lastMessage;

      
      const sidebarContent = `
        <div class="chat-item" data-user-id="${otherUserId}">
          <ul>${otherUserId === 1 ? 'Seller' : 'Buyer'}</ul>
          <div id="content">
            <p>${truncatedMessage}</p>
            <small id="sent-time">${timestamp}</small>
          </div>
        </div>
      `;
      
      $('.message-list').append(sidebarContent);
    },
    error: (err) => {
      console.error('Error loading sidebar chat:', err);
    }
  });
  
  // Post new sent message to chat window
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

  // Use enter key to submit messages
  $('#message-content').on('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      $('#chat-submit').click();
    } else if (event.key === Enter && event.shiftKey);
  })

});


