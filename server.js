const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const logger = require("morgan");
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("./models");
const app = express();
const PORT = process.env.PORT || 8080;

// Connect to the Mongo database
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraper";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// MIDDLEWARE CONFIGURATION:
// Use morgan logger for logging requests
app.use(logger("dev"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(express.static("public"));

// ROUTES
app.get("/", (req, res) => {
  db.Dog.find(function(err, docs) {
    // console.log(docs)
    res.render("index", {
      dogs: docs
    });
  });
});

app.get("/favorites", (req, res) => res.render("favorites"));

console.log("Scraping poo off our shoes...");

// A GET route for scraping the website
app.get("/scrape", (req, res) => {
    axios.get("https://savinggracenc.org/our-dogs/").then(response => {
    const $ = cheerio.load(response.data);
    const result = [];

    $(".picture-item__inner").each((i, element) => {
        // Add the text and href of every link...
        const name = $(element).find("div.picture-item__title").text();
        const pic = $(element).find("div.picture-item__glyph").find("p").find("img").attr("src");
        const breed = $(element).find("div.picture-item_tags").find("item__breed-tag").text();
        const tags = $(element).find("div.picture-item__tags").text();
        let description = $(element).find("div.my-pet-description").find(".pf-description").text();
        description = description.substr(0, 140) + "...";
        const link = $(element).find("div.my-pet-petfinder_url").find("a").attr("href");

        const dog = {
          name,
          pic,
          breed,
          tags,
          description,
          link
        };

        db.Dog.create(dog)
        .then(dbDog => {
            // console.log(dbDog);
        })
        .catch(err => {
            // console.log(`Duplicate key: ${dog.name}`);
        });
    });

    // Send a message to the client
    res.send("Scrape Complete");
    });
});

// Route for getting all Dogs from the db
app.get("/dogs", (req, res) => {
  db.Dog.find({})
    .then(dbDog => {
      res.json(dbDog);
    })
    .catch(err => {
      res.json(err);
    });
});

// Route for grabbing a specific Dog by id, populate it with it's note
app.get("/dogs/:id", (req, res) => {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Dog.findOne({ name: req.params.id })
    .populate("note")
    .then(dbDog => {
      res.json(dbDog);
    })
    .catch(err => {
      res.json(err);
    });
});

// Route for saving/updating a Dog's associated Note
app.post("/dogs/:id", (req, res) => {
  // Create a new note and pass the req.body to the entry
  console.log(req.body)
  db.Note.create({
    body: req.body.note
  })
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

app.post("/dogs/:id/notes", (req, res) => {
  db.Note.create({body: req.body.note})
  .then(dbNote => {
    return db.Dog.findOneAndUpdate({ name: req.params.id }, { note: dbNote._id });
  })
  .then(response => res.sendStatus(200));
});

// Start the server
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
