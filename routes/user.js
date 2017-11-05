//
var express = require('express'),
    router = express.Router(),
    userSchema = require('../models/user.js');


router.get('/', function(req, res) {
    console.log("user get /");
    var whereQuery = req.query.where ? JSON.parse(req.query.where) : {};
    var sortQuery = req.query.sort ? JSON.parse(req.query.sort) : {};
    var selectQuery = req.query.select ? JSON.parse(req.query.select) : {};
    var skipQuery = req.query.skip ? parseInt(req.query.skip) : 0;

    var query = userSchema.find({}).where(whereQuery).sort(sortQuery).select(selectQuery).skip(skipQuery);
    query = req.query.limit ? query = query.limit(parseInt(req.query.limit)) : query;
    query = req.query.count === 'true' ? query = query.count() : query;
    query.exec(function(err, users) {
        if(err) {
            res.status(500).send({
                message: err,
                data: []
            });
        } else {
            res.status(200).send({
                message: 'OK',
                data: users
            })
        }
    });

});

router.post('/', function(req, res) {
    console.log("user post /");
    if (!req.body.name || !req.body.email) {
        res.status(400).send({
            message: "You need to have both a name and a email",
            data: []
        });
        return;
    }

    userSchema.find({email: req.body.email}).exec(function(err, users) {
        if(err) {
            res.status(500).send({
                message: err,
                data: []
            });
        } else if (users.length !== 0) {
            res.status(400).send({
                message: 'Email already existed',
                data: users[0]
            });
        } else {
            var newUser = {
                name: req.body.name,
                email: req.body.email,
                pendingTasks: req.body.pendingTasks ? req.body.pendingTasks : []
            };

            userSchema.create(newUser, function(err, user) {
                if(err) {
                    res.status(500).send({
                        message: err,
                        data: {}
                    });
                } else {
                    res.status(201).send({
                        message: 'OK',
                        data: user
                    });
                }
            })
        }

    });
});

router.get('/:id',function(req,res){
    console.log("user get /:id");
    userSchema.find({_id: req.params.id}).exec(function(err, users) {
        if(err) {
            res.status(500).send({
                message: err,
                data: {}
            });
        } else if (users.length === 0) {
            res.status(404).send({
                message: 'User Not Found',
                data: {}
            })
        } else {
            res.status(200).send({
                message: 'OK',
                data: users[0]
            })
        }
    });
});

router.put('/:id',function(req,res){
    console.log("user put /:id");
    // console.log(req.body);

    // if (!req.body.name || !req.body.email) {
    //     res.status(400).send({
    //         message: "You need to have both a name and a email",
    //         data: []
    //     });
    //     return;
    // }

    userSchema.find({email: req.body.email}).exec(function(err, users) {
        if(err) {
            res.status(500).send({
                message: err,
                data: {}
            });
            return;
        }

        var dupEmail = false;
        for (var i = 0; i < users.length; i++) {
            // console.log("user ", i, users[i].email);
            if (users[i]._id != req.params.id) {
                dupEmail = true;
            }
        }

        if (dupEmail) {
            res.status(400).send({
                message: 'Email already existed',
                data: {}
            });
        } else {
            var updatedUser = {};
            if (req.body.name){
                updatedUser.name = req.body.name;
            }
            if (req.body.email) {
                updatedUser.email = req.body.email;
            }
            if (req.body.pendingTasks){
                updatedUser.pendingTasks = req.body.pendingTasks;
            }

            userSchema.findByIdAndUpdate(req.params.id, {$set:updatedUser}, {new: true}).exec(function(err, user) {
                if(err) {
                    res.status(500).send({
                        message: err,
                        data: {}
                    });
                } else if (!user) {
                    res.status(404).send({
                        message: 'User Not Found',
                        data: {}
                    });
                }else {
                    res.status(200).send({
                        message: 'user information updated',
                        data: user
                    });
                }
            });
        }

    });
});



router.delete('/:id', function(req, res) {
    console.log("user delete /:id");
    userSchema.remove({_id: req.params.id}, function(err, user) {
        if(err) {
            res.status(500).send({
                message: err,
                data: []
            });
        // } else if (!JSON.parse(user).n) {
        } else if (!user || !JSON.parse(user).n) {

            console.log("hellow world: ", JSON.parse(user).n);
            res.status(404).send({
                message: 'User Not Found',
                data: {}
            });
        } else {
            res.status(200).send({
                message: 'User deleted',
                data: user
            });
        }
    });
});

module.exports = router;