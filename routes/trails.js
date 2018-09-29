var db = require('../db');
var auth = require('../auth');
var ObjectID = require('mongodb').ObjectID;

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
    console.log('Retrieving trail: ' + id);
    db.collection('trails', function(err, collection) {
        collection.findOne({'_id':id}, function(err, item) {
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
    db.collection('trails', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.findByTicket = function(req, res) {
    if (!auth.validateUser(req.headers.token))
    {
        res.statusCode = 401;
        res.send({
            result: 'Unauthorized',
        });
        return;
    }
    var id = req.params.ticket;
    console.log('Finding trails by ticket: ' + id);
    db.collection('trails', function(err, collection) {
        collection.find({'TicketId':id}, {sort: [['_id', 1]]}).toArray(function(err, items) {
            console.log('Returning trails: ' + items.length);
            res.send(items);
        });
    });
};

exports.findByTicketFromId = function(req, res) {
    if (!auth.validateUser(req.headers.token))
    {
        res.statusCode = 401;
        res.send({
            result: 'Unauthorized',
        });
        return;
    }
    var id = req.params.ticket;
    var fromid = req.params.fromid;
    console.log('Finding trails by ticket: ' + id + " fromid:" + fromid);
    db.collection('trails', function(err, collection) {
        collection.find({'TicketId':id, '_id' : {$gt: ObjectID(fromid)}}, {sort: [['_id', 1]]}).toArray(function(err, items) {
            console.log('Returning trails from date: ' + items.length);
            res.send(items);
        });
    });
};

exports.findFirstByTicket = function(req, res) {
    if (!auth.validateUser(req.headers.token))
    {
        res.statusCode = 401;
        res.send({
            result: 'Unauthorized',
        });
        return;
    }
    var id = req.params.ticket;
    console.log('Finding first trail by ticket: ' + id);
    db.collection('trails', function(err, collection) {
        collection.findOne({'TicketId': id}, {limit: 1, sort: [['_id', 1]]}, function(err, document) {
            res.send(document);
        });
    });
};

exports.findLastByTicket = function(req, res) {
    if (!auth.validateUser(req.headers.token))
    {
        res.statusCode = 401;
        res.send({
            result: 'Unauthorized',
        });
        return;
    }
    var id = req.params.ticket;
    console.log('Finding last trail by ticket: ' + id);
    db.collection('trails', function(err, collection) {
        collection.findOne({'TicketId': id}, {limit: 1, sort: [['_id', -1]]}, function(err, document) {
            console.log('Returning latest ' + JSON.stringify(document));
            res.send(document);
        });
    });
};
 
exports.addTrail = function(req, res) {
    if (!auth.validateUser(req.headers.token))
    {
        res.statusCode = 401;
        res.send({
            result: 'Unauthorized',
        });
        return;
    }
    var trail = req.body;
    console.log('Adding trail: ' + JSON.stringify(trail));
    db.collection('trails', function(err, collection) {
        collection.insert(trail, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}
 
exports.updateTrail = function(req, res) {
    if (!auth.validateUser(req.headers.token))
    {
        res.statusCode = 401;
        res.send({
            result: 'Unauthorized',
        });
        return;
    }
    var id = req.params.id;
    var trail = req.body;
    console.log('Updating trail: ' + id);
    console.log(JSON.stringify(trail));
    db.collection('trails', function(err, collection) {
        collection.update({'_id':ObjectID(id)}, trail, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating trail: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(trail);
            }
        });
    });
}
 
exports.deleteTrail = function(req, res) {
    if (!auth.validateUser(req.headers.token))
    {
        res.statusCode = 401;
        res.send({
            result: 'Unauthorized',
        });
        return;
    }
    var id = req.params.id;
    console.log('Deleting trail: ' + id);
    db.collection('trails', function(err, collection) {
        collection.remove({'_id':ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

exports.deleteByTicket = function(req, res) {
    if (!auth.validateUser(req.headers.token))
    {
        res.statusCode = 401;
        res.send({
            result: 'Unauthorized',
        });
        return;
    }
    var id = req.params.ticket;
    console.log('Deleting trails by ticket: ' + id);
    db.collection('trails', function(err, collection) {
        collection.remove({'TicketId':id}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}
