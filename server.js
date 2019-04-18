const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const logger = require("morgan");
const axios = require("axios");
const cheerio = require("cheerio");
// const db = require("./models");
const PORT = 3003;
const app = express();

// Connect to the Mongo database
mongoose.connect("mongodb://localhost/rescue", { useNewUrlParser: true });

// MIDDLEWARE CONFIGURATION: 
// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// ROUTES
// A GET route for scraping the website
app.get("/scrape", (req, res) => {
    // First, we grab the body of the html with axios
    axios.get("https://savinggracenc.org/our-dogs/").then(response => {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    const $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $(".picture-item").each((i, element) => {
        // Save an empty result object
        const result = {};

        // Add the text and href of every link, and save them as properties of the result object
        result.name = $(element).children("div.picture-item__title").text();
        result.pic = $(element).children("div.picture-item__glyph").attr("src");
        result.breed = $(element).children("div.picture-item_tags.item__breed-tag").text();
        result.tags = $(element).children("div.picture-item__tags").text();
        result.description = $(element).children("div.my-pet-description.pf-description").text();
        result.link = $(element).children("div.my-pet-petfinder_url.a").attr("href");

        // Create a new Dog using the `result` object built from scraping
        db.Dog.create(result)
        .then(dbDog => {
            // View the added result in the console
            console.log(dbDog);
        })
        .catch(err => {
            // If an error occurred, log it
            console.log(err);
        });
    });

    // Send a message to the client
    res.send("Scrape Complete");
    });
});

// Route for getting all Dogs from the db
app.get("/rescue", (req, res) => {
  db.Dog.find({})
    .then(dbDog => {
      res.json(dbDog);
    })
    .catch(err => {
      res.json(err);
    });
});

// Route for grabbing a specific Dog by id, populate it with it's note
app.get("/rescue/:id", (req, res) => {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Dog.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(dbDog => {
      res.json(dbDog);
    })
    .catch(err => {
      res.json(err);
    });
});

// Route for saving/updating an Dog's associated Note
app.post("/rescue/:id", (req, res) => {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(dbNote => {
      // If a Note was created successfully, find one Dog with an `_id` equal to `req.params.id`. Update the Dog to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Dog.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(dbDog => {
      res.json(dbDog);
    })
    .catch(err => {
      res.json(err);
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
