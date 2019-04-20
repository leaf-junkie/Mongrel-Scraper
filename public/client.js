// Grab the dogs as a json
app.get("/dogs", data => {
  // For each one
  for (let i = 0; i < data.length; i++) {
    // Display the apropriate information on the page
    $(".dogs").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
});
  
// On click, scrape new data from Saving Grace 
// $("").on("click", function() {

// });
// Add dog to favorites

// Create Note

// Save Note

// Update Note

// Delete Note








  // // Whenever someone clicks a p tag
  // $(document).on("click", "p", function() {
  //   // Empty the notes from the note section
  //   $("#notes").empty();
  //   // Save the id from the p tag
  //   const thisId = $(this).attr("data-id");
  
  //   // Now make an ajax call for the dog
    // $.ajax({
    //   method: "GET",
    //   url: "/dogs/" + thisId
    // })
  //     // With that done, add the note information to the page
  //     .then(data => {
  //       console.log(data);
  //       // The title of the dog
  //       $("#notes").append("<h2>" + data.title + "</h2>");
  //       // An input to enter a new title
  //       $("#notes").append("<input id='titleinput' name='title' >");
  //       // A textarea to add a new note body
  //       $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
  //       // A button to submit a new note, with the id of the dog saved to it
  //       $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
  //       // If there's a note in the dog
  //       if (data.note) {
  //         // Place the title of the note in the title input
  //         $("#titleinput").val(data.note.title);
  //         // Place the body of the note in the body textarea
  //         $("#bodyinput").val(data.note.body);
  //       }
  //     });
  // });
  
  // // When you click the savenote button
  // $(document).on("click", "#savenote", function() {
  //   // Grab the id associated with the dog from the submit button
  //   const thisId = $(this).attr("data-id");
  
  //   // Run a POST request to change the note, using what's entered in the inputs
  //   $.ajax({
  //     method: "POST",
  //     url: "/dogs/" + thisId,
  //     data: {
  //       // Value taken from title input
  //       title: $("#titleinput").val(),
  //       // Value taken from note textarea
  //       body: $("#bodyinput").val()
  //     }
  //   })
  //     // With that done
  //     .then(data => {
  //       // Log the response
  //       console.log(data);
  //       // Empty the notes section
  //       $("#notes").empty();
  //     });
  
  //   // Also, remove the values entered in the input and textarea for note entry
  //   $("#titleinput").val("");
  //   $("#bodyinput").val("");
  // });
  