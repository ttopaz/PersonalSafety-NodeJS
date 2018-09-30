# PersonalSafety-NodeJS
 
 This is an API backend for the Personal Safety project. Its using MongoDB for tracking trails.
 
 ## MongoDB configuration
 
 Follow the [link](https://docs.mongodb.com/manual/administration/install-community/) to install MongoDB if needed.
 
 Make sure the service is running
 ~~~
 mongod
 ~~~
 
By default, MongoDB is listening on port 27017, but can be changed in config file. Make sure to change the db.js to use the appropriate port.

Start MongoDB shell by running
~~~
mongo
~~~

Execute the following to create the 'tracks' database and needed collections:
~~~
> use tracks
> db.createCollection("users")
> db.createCollection("trails")
> db.createCollection("tickets")
> db.createCollection("ticket_users")
~~~





