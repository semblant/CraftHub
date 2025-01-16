// Client facing scripts here

// Function to fetch all saved messages within the database and load them to the chat window
const fetchMessages = function () {
  $.ajax({
    method: 'GET',
    url: '/api/messages'
  })
    .done((response) => {

      $('.active-messages').empty();

      // console.log(response, 'RESPONSE!!!!!!');
      // console.log(response.messages, '!! FIRST MESSAGE !!')
      const messages = response.messages;

      for (let message of messages) {

        const messageHtml = `
          <div class="message-sent">
            <p>${message.content}</p>
            <span class="timestamp">${new Date(message.timestamp).toLocaleTimeString()}</span>
          </div>
          `;
        $('.active-messages').append(messageHtml);
      }

      })
};

$(document).ready(() => {
  console.log('Hello');

  fetchMessages();

  // Reload messages every five seconds
  setInterval(fetchMessages, 5000);

  $.ajax({
    url: '/api/messages/availableChat',
    method: 'GET',
    success: function(response) {
      const { otherUserId, lastMessage, timestamp } = response;

      const sidebarContent = `
        <div class="chat-item" data-user-id="${otherUserId}">
          <ul>User ${otherUserId === 1 ? 'Admin' : 'Buyer'}</ul>
          <div id="content">
            <p>Last Message: ${lastMessage}</p>
            <small id="sent-time">${timestamp ? new Date(timestamp).toLocaleString() : "No messages yet"}</small>
          </div>
        </div>
      `;
      
      $('.message-list').append(sidebarContent);
    },
    error: function(err) {
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

});


