$(function() {

  var socket = io();
  var $messages = $("#messages");
  var $form = $("#new-message-form");
  var $textarea = $("#new-message");

  if (!localStorage.getItem('username')) {
    var $modal = $("#modal");
    $modal.modal({ keyboard: false });
    $modal.find('form').on('submit', function(e) {
      e.preventDefault();
      var username = $modal.find('input').val();
      localStorage.setItem('username', username)
      $modal.modal('hide');
      socket.emit('new user from client', username);
    });
  } else {
    var username = localStorage.getItem('username');
    socket.emit('new user from client', username);
  }

  $form.on('submit', function(e) {
    e.preventDefault();
    var newMessage = $textarea.val();
    socket.emit('new message from client', newMessage);
    $textarea.val('');
  });

  socket.on('new user from server', function(data) {
    $messages.append($("<li>", {
      class: 'user-info',
      text: data + " has joined the chat!"
    }));
  });

  socket.on('disconnected user from server', function(data) {
    $messages.append($("<li>", {
      class: 'user-info',
      text: data + " has left the chat :("
    }));
  });

  socket.on('new message from server', function(data) {
    $messages.append($("<li>", {
      text: username + ": " + data
    }));
  });

});
