'use strict';

(function () {

  var currentPollId;

  $('#sureModal').on('show.bs.modal', function(e) {
      currentPollId = e.relatedTarget.dataset.pollid;

      var $modal = $(this);
      $modal.find('#modal-body-text').html(e.relatedTarget.dataset.question);

      console.log(currentPollId);
      console.log(e.relatedTarget);
  });

  $("#delete-poll-btn").click(function(){
    console.log(currentPollId);
    $.ajax({
      type: 'DELETE',
      url: '/poll/delete/' + currentPollId,
      data: { id: currentPollId },
      success: function(response) {
        $("#poll-row-" + currentPollId).remove();

        $("#server-response-msg").html('<div class="alert ' + response.display_msg_type
          + ' alert-dismissible fade show" role="alert" id="server-response-msg">'
          + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true"> &times; </span></button>'
          + response.display_msg + '</div>');
      },
    });
  });


})();
