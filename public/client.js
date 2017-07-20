$(function() {

  io.connect();

  if (!localStorage.getItem('username')) {
    var $modal = $("#modal");
    $modal.modal({ keyboard: false });
    $modal.find('form').on('submit', function(e) {
      e.preventDefault();
      localStorage.setItem('username', $modal.find('input').val())
      $modal.modal('hide');
    });
  }

});
