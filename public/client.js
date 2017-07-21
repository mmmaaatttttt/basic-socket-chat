$(function() {

  var socket = io();
  var $messages = $("#messages");
  var $form = $("#new-message-form");
  var $newMessage = $("#new-message");
  var $users = $("#users");
  var username;

  if (!localStorage.getItem('username')) {
    var $modal = $("#modal");
    $modal.modal({ keyboard: false });
    $modal.find('form').on('submit', function(e) {
      e.preventDefault();
      username = $modal.find('input').val();
      localStorage.setItem('username', username)
      $modal.modal('hide');
      socket.emit('new user from client', { username: username });
    });
  } else {
    username = localStorage.getItem('username');
    socket.emit('new user from client', { username: username });
  }

  $form.on('submit', function(e) {
    e.preventDefault();
    var message = $newMessage.val();
    if (/^\/giphy/.test(message)) {
      $.get('https://api.giphy.com/v1/gifs/search', {
        api_key: 'a319b99a12b84b0cb1caf9d578c56f5b',
        q: message.split("/giphy")[1].trim(),
        rating: "g",
        limit: 50
      })
      .then(function(res) {
        if (res.data.length > 0) {
          var randomIdx = Math.floor( Math.random() * res.data.length );
          var randomGif = res.data[randomIdx];
          socket.emit('new gif from client', { 
            url: randomGif.images.original.url,
            username: username
          });
        } else {
          $messages.append($("<li>", {
            text: "Oh no, no gif matched your search term. Please try again.",
            class: "warning"
          }))
        }
      })
      .catch(function(err) {
        console.log(err);
      })
    } else {
      socket.emit('new message from client', { 
        message: message, 
        username: username 
      });
    }
    $newMessage.val('');
  });

  socket.on('new user from server', function(data) {
    var newUser = data.users[data.users.length - 1];
    $messages.append($("<li>", {
      class: 'user-info',
      text: newUser + " has joined the chat!"
    }));
    scroll();
    displayUsers(data.users);
  });

  socket.on('disconnected user from server', function(data) {
    $messages.append($("<li>", {
      class: 'user-info',
      text: data.username + " has left the chat :("
    }));
    scroll();
    displayUsers(data.users);
  });

  socket.on('new message from server', function(data) {
    $messages.append($("<li>", {
      text: data.username + ": " + data.message
    }));
    scroll();
  });

  socket.on('new gif from server', function(data) {
    var $newLi = $("<li>", {
      text: data.username + ": "
    });
    $newLi.append($("<img>", {
      src: data.url
    }));
    $messages.append($newLi);
    scroll();
  });

  function displayUsers(users) {
    $users.empty();
    users.forEach(function(user) {
      $users.append($("<li>", { text: user }));
    });
  }

  function scroll() {
    $("body").animate({
      scrollTop: $messages.height()
    });
  }

});
