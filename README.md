# PersonalSafety-NodeJS
 
 This is an API backend for the Personal Safety project. It's using MongoDB for tracking trails.
 
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
### Collections
<b>users</b>
~~~
{
  "_id" : ObjectId("53670f349514d3981af79dfe"),
  "name" : "",
  "user" : null,
  "passwordHash" : new BinData(0, "),
  "salt" : ""
}
~~~
<b>trails</b>
~~~
{
  "_id" : ObjectId("58a9ecd1c87274d035bf31d2"),
  "Accuracy" : 9,
  "Altitude" : 325,
  "Bearing" : 0,
  "Created" : "Feb 19, 2017 2:06:56 PM",
  "Latitude" : 33.9553814,
  "Longitude" : -84.3209329,
  "Speed" : 0,
  "TicketId" : "58a9e598c87274d035bf2d21",
  "Time" : 1487531217000.0
}
~~~
<b>tickets</b>
~~~
{
  "_id" : ObjectId("58bcbca0a3b39d9003a77a93"),
  "Active" : true,
  "Code" : "081343",
  "Created" : "Mar 5, 2017 8:34:23 PM",
  "DeviceId" : "02:00:00:00:00:00",
  "Expires" : "Mar 5, 2017 9:34:23 PM",
  "Trails" : 0,
  "UserId" : "",
  "UserName" : "My Info"
}
~~~
<b>ticket_users</b>
~~~
{
  "_id" : ObjectId("58bce9e7a3b39d9003a77abe"),
  "TargetCreated" : "Mar 5, 2017 11:47:34 PM",
  "TargetUserId" : "",
  "TargetUserName" : "Me",
  "TicketId" : "58bce9cca3b39d9003a77abc",
  "Active" : false,
  "Code" : "072130",
  "Created" : "Mar 5, 2017 11:47:07 PM",
  "DeviceId" : "02:00:00:00:00:00",
  "Expires" : "Mar 6, 2017 12:47:07 AM",
  "Trails" : 0,
  "UserId" : "",
  "UserName" : "My Info"
}
~~~
