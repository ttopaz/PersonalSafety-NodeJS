var db = require('../db');
var auth = require('../auth');
var ObjectID = require('mongodb').ObjectID;

exports.findByTicket = function(req, res) {
    if (!auth.validateUser(req.headers.token))
    {
        res.statusCode = 401;
        res.send({
            result: 'Unauthorized',
        });
        return;
    }
    var ticket_id = req.params.ticketId;
    console.log('Retrieving ticket users: ' + ticket_id);
    db.collection('ticket_users', function(err, collection) {
        collection.find({'TicketId':ticket_id}).toArray(function(err, items) {
            console.log('Retrieved ' + (items ? items.length : 0) + ' ticket users');
            res.send(items);
        });
    });
};

exports.findTicketsByUser = function(req, res, active) {
    if (!auth.validateUser(req.headers.token))
    {
        res.statusCode = 401;
        res.send({
            result: 'Unauthorized',
        });
        return;
    }
    var user = req.params.user;
    console.log('Retrieving user tickets: ' + user);
    db.collection('ticket_users', function(err, collection) {
        var query = active ? {'TargetUserId':user, 'Active':true} : {'TargetUserId':user};
        collection.find(query, {sort: [['TargetCreated', -1]]}).toArray(function(err, items) {
            console.log('Retrieved ' + (items ? items.length : 0) + ' ticket users');
            var hash = {};
            var rest = [];
            for(var i = 0; i < items.length; i++)
            {
                var item = items[i];
                if (hash[item.UserId] == undefined)
                {
                    rest.push(item);
                    hash[item.UserId] = 1;
                }
            }
            res.send(rest);
        });
    });
};

exports.findByUser = function(req, res) {
    exports.findTicketsByUser(req, res);
};

exports.findActiveByUser = function(req, res) {
    exports.findTicketsByUser(req, res, true);
};

exports.findByTicketUser = function(req, res) {
    if (!auth.validateUser(req.headers.token))
    {
        res.statusCode = 401;
        res.send({
            result: 'Unauthorized',
        });
        return;
    }
    var ticket_id = req.params.ticketId;
    var user = req.params.user;
    console.log('Retrieving ticket user: ' + ticket_id + ',' + user_id);
    db.collection('ticket_users', function(err, collection) {
        collection.findOne({'TicketId':ticket_id, 'User':user}, function(err, item) {
            res.send(item);
        });
    });
};

exports.addTicketUser = function(req, res) 
{
    if (!auth.validateUser(req.headers.token))
    {
        res.statusCode = 401;
        res.send({
            result: 'Unauthorized',
        });
        return;
    }
 	var ticketUser = req.body;
    console.log('Adding ticket user: ' + JSON.stringify(ticketUser));
    db.collection('ticket_users', function(err, collection) 
    {
        collection.findOne({'TicketId':ticketUser.TicketId, 'TargetUserId':ticketUser.TargetUserId}, function(err, item) 
        {
            if (!item)
            {
                collection.insert(ticketUser, {safe:true}, function(err, result) 
                {
                    if (err) 
                    {
                        res.send({'error':'An error has occurred'});
                    } 
                    else 
                    {
                        console.log('Success: ' + JSON.stringify(result[0]));
                        res.send(result[0]);
                    }
                });
            }
            else
            {
                console.log('Found existing: ' + JSON.stringify(item));
                res.send(item);
            }
       });
   });
}

exports.updateTicketUser = function(req, res) {
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
    db.collection('ticket_users', function(err, collection) {
        collection.update({'_id':ObjectID(id)}, ticket, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating ticket user: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(ticket);
            }
        });
    });
}
