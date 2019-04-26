$(document).ready(function() {
  $("#scrapeBtn").on("click", function() {
    axios.get("/scrape")
    .then(response => console.log(response))
    .catch(err => console.log(err))
  });

  $("#exampleModalCenter").on('show.bs.modal', function(event) {
    var button = $(event.relatedTarget);
    var dogName = button.data('name');
    var modal = $(this);
    modal.find('.modal-title').text('New note about ' + dogName);
    modal.find("#note-text").val("");
    axios.get(`/dogs/${dogName}`)
    .then(response => {
      if (response.data && response.data.note && response.data.note.body) {
        modal.find("#note-text").val(response.data.note.body);
      }
    });
    // modal.find('.modal-body input').val(recipient)
    modal.find('#saveNote').on("click", function(data) {
      var note = modal.find("#note-text").val();
      axios.post(`/dogs/${dogName}/notes`, {
        note
      });
    });
  });
});

//   .then(() => {
//     // Grab the dogs as a json
//     axios.get("/dogs")
//     .then(data => {
//       // For each one
//       for (let i = 0; i < data.length; i++) {
//         // Display the apropriate information on the page
//         $(".dogs").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
//       }
//     });
//   });