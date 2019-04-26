$(document).ready(function() {
  axios.get("/scrape")
  .then(response => console.log(response))
  .then(() => {
    // Grab the dogs as a json
    axios.get("/dogs")
    .then(data => {
      // For each one
      for (let i = 0; i < data.length; i++) {
        // Display the apropriate information on the page
        $(".dogs").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
      }
    });
  });
});