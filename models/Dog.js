const mongoose = require("mongoose");

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
const DogSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  pic: {
    type: String,
    required: true
  },
  breed: {
    type: String
  },
  tags: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  link: {
    type: String
  },
  // `note` is an object that stores a Note id
  // The ref property links the ObjectId to the Note model
  // This allows us to populate the Dog with an associated Note
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// This creates our model from the above schema, using mongoose's model method
const Dog = mongoose.model("Dog", DogSchema);

// Export the Dog model
module.exports = Dog;
