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
      socket.emit('new user from client', username);
    });
  } else {
    username = localStorage.getItem('username');
    socket.emit('new user from client', username);
  }

  $form.on('submit', function(e) {
    e.preventDefault();
    var message = $newMessage.val();
    socket.emit('new message from client', { message: message, username: username });
    $newMessage.val('');
  });

  socket.on('new user from server', function(data) {
    var newUser = data.users[data.users.length - 1];
    $messages.append($("<li>", {
      class: 'user-info',
      text: newUser + " has joined the chat!"
    }));
    displayUsers(data.users);
  });

  socket.on('disconnected user from server', function(data) {
    $messages.append($("<li>", {
      class: 'user-info',
      text: data.username + " has left the chat :("
    }));
    displayUsers(data.users);
  });

  socket.on('new message from server', function(data) {
    console.log(data);
    $messages.append($("<li>", {
      text: data.username + ": " + data.message
    }));
  });

  function displayUsers(users) {
    $users.empty();
    users.forEach(function(user) {
      $users.append($("<li>", { text: user }));
    })
  }

});
