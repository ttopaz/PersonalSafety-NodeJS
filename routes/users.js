var db = require('../db');
var auth = require('../auth');
var crypto = require('crypto');

exports.findById = function(req, res) {
    if (!auth.validateUser(req.headers.token))
    {
        res.statusCode = 401;
        res.send({
            result: 'Unauthorized',
        });
        return;
    }
    var id = req.params.id;
    console.log('Retrieving user: ' + id);
    db.collection('users', function(err, collection) {
        collection.findOne({'_id':id}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findByUser = function(req, res) {
    if (!auth.validateUser(req.headers.token))
    {
        res.statusCode = 401;
        res.send({
            result: 'Unauthorized',
        });
        return;
    }
    var id = req.params.user;
    console.log('Retrieving user: ' + user);
    db.collection('users', function(err, collection) {
        collection.findOne({'user':user}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    if (!auth.validateUser(req.headers.token))
    {
        res.statusCode = 401;
        res.send({
            result: 'Unauthorized',
        });
        return;
    }
    console.log('Getting users');
    db.collection('users', function(err, collection) {
        collection.find().toArray(function(err, items) {
            console.log('Retrieved ' + (items ? items.length : 0) + ' users');
            res.send(items);
        });
    });
};

exports.deleteUser = function(req, res) {
    if (!auth.validateUser(req.headers.token))
    {
        res.statusCode = 401;
        res.send({
            result: 'Unauthorized',
        });
        return;
    }
    var id = req.params.id;
    console.log('Deleting user: ' + id);
    db.collection('users', function(err, collection) {
        collection.remove({'_id':id}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

exports.addUser = function(req, res) {
    var user = req.body;
    var name = user.name;
 	var username = user.username;
	var password = user.password;
    console.log('Adding user: ' + JSON.stringify(username));
    auth.createLogin(name, username, password, function(err, result) 
    {
        if (err) 
            res.send({'error':err});
        else 
        {
            console.log('Success: ' + JSON.stringify(result));
            var token = auth.createUserToken(result._id);
            res.send({_id:result._id, token : token});
        }
    });
}

exports.login = function(req, res) {
	var username = req.headers.username;
	var password = req.headers.password;

    var token = auth.createUserToken(username);
    res.send({_id:username, token : token});

/*    auth.validateLogin(username, password, function(err, result) 
    {
        if (err || !result || !result._id)
            res.send({'error':'Invalid Login'});
        else
        {
            var token = auth.createUserToken(result._id);
            res.send({_id:result._id, token : token});
        }
    });*/
}

exports.validateToken = function(req, res) {
	var token = req.headers.token;

    if (auth.validateUser(token))
        res.send({token : token});
    else 
        res.send({'error': 'Bad Token'});
}


