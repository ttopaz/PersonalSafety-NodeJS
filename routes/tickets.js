var db = require('../db');
var auth = require('../auth');
var async = require('async');
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
    console.log('Retrieving ticket: ' + id);
    db.collection('tickets', function(err, collection) {
        collection.findOne({'_id':ObjectID(id)}, function(err, item) {
            console.log('Success: ' + JSON.stringify(item));
            res.send(item);
        });
    });
};

exports.findByCode = function(req, res) {
    if (!auth.validateUser(req.headers.token))
    {
        res.statusCode = 401;
        res.send({
            result: 'Unauthorized',
        });
        return;
    }
    var id = req.params.id;
    console.log('Retrieving ticket: ' + id);
    db.collection('tickets', function(err, collection) {
        collection.findOne({'Code':id}, function(err, item) {
            res.send(item);
        });
    });
};
 
exports.findAll = function(req, res) {
    console.log('Getting tickets');
    if (!auth.validateUser(req.headers.token))
    {
        res.statusCode = 401;
        res.send({
            result: 'Unauthorized',
        });
        return;
    }
    console.log('Retrieving tickets');
    db.collection('tickets', function(err, collection) {
        collection.find().toArray(function(err, items) {
            console.log('Retrieved ' + (items ? items.length : 0) + ' tickets');
            db.collection('trails', function(err, collection1) 
            {
                async.each(items, function( item, callback) 
                {
                    collection1.find({'TicketId':item._id.toString()}).count(function (err, count)
                    {
                        if (!err)
                        {
                            console.log('count: ' + count);
                            item.Trails = count;
                        }
                        callback();
                    });
                }
                , function(err)
                {
                    if( err ) 
                    {
                      console.log('failed to process');
                    } 
                    else 
                    {
                        console.log('sending items');
                        res.send(items);
                    }
                });
            });
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
    console.log('Retrieving tickets for user ' + req.params.user);
    db.collection('tickets', function(err, collection) {
        collection.find({'UserId':req.params.user}, {sort: [['Created', -1]]}).toArray(function(err, items) {
            console.log('Retrieved ' + (items ? items.length : 0) + ' tickets');
            db.collection('trails', function(err, collection1) 
            {
                async.each(items, function( item, callback) 
                {
                    collection1.find({'TicketId':item._id.toString()}).count(function (err, count)
                    {
                        if (!err)
                        {
                            console.log('count: ' + count);
                            item.Trails = count;
                        }
                        callback();
                    });
                }
                , function(err)
                {
                    if( err ) 
                    {
                      console.log('failed to process');
                    } 
                    else 
                    {
                        console.log('sending items');
                        res.send(items);
                    }
                });
            });
        });
    });
};
 
exports.addTicket = function(req, res) {
    if (!auth.validateUser(req.headers.token))
    {
        res.statusCode = 401;
        res.send({
            result: 'Unauthorized',
        });
        return;
    }
    var ticket = req.body;
    console.log('Adding ticket: ' + JSON.stringify(ticket));
    db.collection('tickets', function(err, collection) {
        collection.insert(ticket, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });

/*        collection.findAndModify(
                      {DeviceId: ticket.DeviceId}, // query
                      [['_id','asc']],
                      {$set: ticket}, 
                      {new : true, upsert : true}, // options
                function(err, result) 
                {
                    if (err) 
                    {
                        res.send({'error':'An error has occurred'});
                    } 
                    else 
                    {
                        console.log('Success: ' + JSON.stringify(result));
                        res.send(result);
                    }
                });*/
        });
}
 
exports.updateTicket = function(req, res) {
    if (!auth.validateUser(req.headers.token))
    {
        res.statusCode = 401;
        res.send({
            result: 'Unauthorized',
        });
        return;
    }
    var id = req.params.id;
    var ticket = req.body;
    console.log('Updating ticket: ' + id);
    console.log(JSON.stringify(ticket));
    db.collection('tickets', function(err, collection) {
        collection.update({'_id':ObjectID(id)}, ticket, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating ticket: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(ticket);
            }
        });
    });
}
 
exports.deleteTicket = function(req, res) {
    if (!auth.validateUser(req.headers.token))
    {
        res.statusCode = 401;
        res.send({
            result: 'Unauthorized',
        });
        return;
    }
    var id = req.params.id;
    console.log('Deleting ticket: ' + id);
        db.collection('trails', function(err, collection) 
        {
            collection.remove({'TicketId':id}, {safe:true}, function(err, result) 
            {
                if (err) 
                {
                    res.send({'error':'An error has occurred - ' + err});
                } 
                else 
                {
                    console.log('' + result + ' document(s) deleted');
                    db.collection('ticket_users', function(err, collection) 
                    {
                        collection.remove({'TicketId':id}, {safe:true}, function(err, result) 
                        {
                            if (err) 
                            {
                                res.send({'error':'An error has occurred - ' + err});
                            } 
                            else 
                            {
                                db.collection('tickets', function(err, collection) 
                                {
                                    collection.remove({'_id':ObjectID(id)}, {safe:true}, function(err, result) 
                                    {
                                        if (err) 
                                        {
                                            res.send({'error':'An error has occurred - ' + err});
                                        } 
                                        else 
                                        {
                                            console.log('' + result + ' document(s) deleted');
                                            res.send(req.body);
                                        }
                                    });
                                });
                            }
                       });
                   });
               }
        });
    });
}

exports.deactivateTicket = function(req, res) {
    if (!auth.validateUser(req.headers.token))
    {
        res.statusCode = 401;
        res.send({
            result: 'Unauthorized',
        });
        return;
    }
    var id = req.params.id;
    console.log('Deactivating ticket: ' + id);
    db.collection('tickets', function(err, collection) {
        collection.update({'_id':ObjectID(id)}, {$set: {'Active':false}}, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating ticket: ' + err);
                res.send({'error':'An error has occurred'});
            } 
            else 
            {
                db.collection('ticket_users', function(err, collection) {
                    collection.update({'TicketId':id}, {$set: {'Active':false}}, {safe:true}, function(err, result) {
                        console.log('' + result + ' document(s) updated');
                        res.send("OK");
                    });
                });
            }
        });
    });
}

exports.deleteByUser = function(req, res) {
    if (!auth.validateUser(req.headers.token))
    {
        res.statusCode = 401;
        res.send({
            result: 'Unauthorized',
        });
        return;
    }
    console.log('Deleting user tickets');
        db.collection('tickets', function(err, collection) {
        collection.remove({'UserId':req.headers.userId}, {safe:true}, function(err, result) 
        {
            if (err)
                res.send({'error':'An error has occurred - ' + err});
            else 
            {
                console.log('' + result + ' document(s) deleted');
            }
        });
    });
}