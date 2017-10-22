// Load required packages
var mongoose = require('mongoose');

// Define our user schema
var userSchema = new mongoose.Schema({
    name: String,
    email: {type:String, default: ""}，
    pendingTasks: [String],
    dateCreated: {type:Date, default: Date.now}
});

// Export the Mongoose model
module.exports = mongoose.model('User', userSchema);

