//
var express = require('express'),
    router = express.Router(),
    tasks = require('../models/task.js');


router.get('/', function(req, res) {
    console.log("task get /");
    var whereQuery = req.query.where ? JSON.parse(req.query.where) : {};
    var sortQuery = req.query.sort ? JSON.parse(req.query.sort) : {};
    var selectQuery = req.query.select ? JSON.parse(req.query.select) : {};
    var skipQuery = req.query.skip ? parseInt(req.query.skip) : 0;

    var query = tasks.find({}).where(whereQuery).sort(sortQuery).select(selectQuery).skip(skipQuery);
    query = req.query.limit ? query = query.limit(parseInt(req.query.limit)) : query;
    query = req.query.count === 'true' ? query = query.count() : query;
    query.exec(function(err, task) {
        if(err) {
            res.status(500).send({
                message: err,
                data: []
            });
        } else {
            res.status(200).send({
                message: 'OK',
                data: task
            })
        }
    });

});


router.post('/', function(req, res) {
    console.log("task post /");
    if (!req.body.name || !req.body.deadline) {
        res.staus(400).send({
            message: "You need to have both a name and a deadline",
            data: []
        });
    }

    var newTask = {
        name :req.body.name,
        description: req.body.name ? req.body.name : "No description",
        deadline: req.body.deadline,
        completed: req.body.complete ? req.body.complete : false,
        assignedUser: req.body.assignedUser ? req.body.assignedUser : "",
        assignedUserName: req.body.assignedUserName ? req.body.assignedUserName : "unassigned"
    };

    tasks.create(newTask, function(err, task) {
        if(err) {
            res.staus(500).send({
                message: err,
                data: []
            });
        } else {
            res.status(201).send({
                message: 'OK',
                data: task
            });
        }
    })
});


router.get('/:id',function(req,res){
    console.log("task get /:id");
    tasks.find({_id: req.params.id}).exec(function(err, task) {
        if(err) {
            res.status(500).send({
                message: err,
                data: []
            });
        } else {
            if (task.length === 0) {
                res.status(404).send({
                    message: 'Task Not Found',
                    data: task
                });
            } else {
                res.status(200).send({
                    message: 'OK',
                    data: task
                });
            }

        }
    });
});

router.put('/:id',function(req,res){
    console.log("task put /:id");
    // console.log(req.body);

    var newTask = {
        name :req.body.name,
        description: req.body.description ? req.body.description : "No description",
        deadline: req.body.deadline,
        completed: req.body.completed ? req.body.completed : false,
        assignedUser: req.body.assignedUser ? req.body.assignedUser : "",
        assignedUserName: req.body.assignedUserName ? req.body.assignedUserName : "unassigned"
    };


    tasks.findByIdAndUpdate({_id: req.params.id}, newTask).exec(function(err, task) {
        if(err) {
            res.status(500).send({
                message: err,
                data: []
            });
        } else {
            if (!task) {
                res.status(404).send({
                    message: 'task Not Found',
                    data: task
                });
            } else {
                res.status(201).send({
                    message: 'user information updated',
                    data: task
                });
            }

        }
    });
});



router.delete('/:id', function(req, res) {
    console.log("task delete /:id");
    tasks.remove({_id: req.params.id}, function(err, task) {
        if(err) {
            res.status(500).send({
                message: err,
                data: []
            });
        } else {
            if (!JSON.parse(task).n) {
                res.status(404).send({
                    message: 'Task Not Found',
                    data: []
                });
            } else {
                res.status(201).send({
                    message: 'Task deleted',
                    data: task
                });
            }

        }
    });
});

module.exports = router;