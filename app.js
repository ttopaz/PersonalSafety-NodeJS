
var express = require('express');
var routes = require('./routes');
var trails = require('./routes/trails');
var tickets = require('./routes/tickets');
var ticketUsers = require('./routes/ticketUsers');
var users = require('./routes/users');
var http = require('http');
var path = require('path');
var auth = require('./auth');

var app = express();

// all environments
app.set('port', process.env.PORT || 3100);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

app.get('/users', users.findAll);
app.get('/user/:id', users.findById);
app.get('/user/:id/user', users.findByUser);
app.get('/login', users.login);
app.get('/token', users.validateToken);
app.post('/user', users.addUser);
app.delete('/user/:id', users.deleteUser);

app.get('/trails', trails.findAll);
app.get('/trails/:ticket', trails.findByTicket);
app.get('/trails/:ticket/:fromid', trails.findByTicketFromId);
app.get('/trail/:ticket/first', trails.findFirstByTicket);
app.get('/trail/:ticket/last', trails.findLastByTicket);
app.get('/trail/:id', trails.findById);
app.post('/trail', trails.addTrail);
app.put('/trail/:id', trails.updateTrail);
app.delete('/trail/:id', trails.deleteTrail);
app.delete('/trail/:ticket', trails.deleteByTicket);

app.get('/tickets', tickets.findAll);
app.get('/ticket/:id', tickets.findById);
app.get('/ticket/:id/code', tickets.findByCode);
app.get('/tickets/:user', tickets.findByUser);
app.post('/ticket', tickets.addTicket);
app.put('/ticket/:id', tickets.updateTicket);
app.delete('/ticket/:id/deactivate', tickets.deactivateTicket);
app.delete('/ticket/:id', tickets.deleteTicket);
app.delete('/ticket/:user', tickets.deleteByUser);

app.get('/ticketUsers/:user/active', ticketUsers.findActiveByUser);
app.get('/ticketUsers/:user', ticketUsers.findByUser);
app.put('/ticketUser/:id', ticketUsers.updateTicketUser);
app.get('/ticketUser/:user/:ticket', ticketUsers.findByTicketUser);
app.post('/ticketUser', ticketUsers.addTicketUser);
//app.delete('/ticketUsers/:user', ticketUsers.deleteByUser);
//app.delete('/ticketUsers/:ticket', ticketUsers.deleteByTicket);

app.listen(3100);
console.log('Listening on port 3100...');
