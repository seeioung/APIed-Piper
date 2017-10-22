// Load required packages
var mongoose = require('mongoose');

// Define our user schema
var taskSchema = new mongoose.Schema({
    name: String,
    description: String,
    deadline: {type: Date, default: ""},
    completed: Boolean,
    assignedUser: {type: String, default: ""},
    assignedUserName: {type: String, default: "unassigned"},
    dateCreated: {type:Date, default: Date.now}
});

// Export the Mongoose model
module.exports = mongoose.model('Task', taskSchema);

