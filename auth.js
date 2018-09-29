var jwt = require('jwt-simple');
var db = require('./db');
var crypto = require('crypto');
var uuid = require('uuid');

var Auth = new function()
{
    this.tokenSecret = 'prvTRacker';

    this.authNone = 0;
    this.authValid = 1;
    this.authBadToken = 2;
    this.authTokenExpired = 3;
    this.authUserNameUsed = 4;

    this.createUserToken = function(userId)
    {
        var now = new Date();
        now.setHours(now.getHours() + 1);
        return jwt.encode({userId: userId, expires : now}, this.tokenSecret);
    };

    this.getUserToken = function(user, pass)
    {
        var userId = this.validateLogin(user,pass);
        if (userId)
        {
            var now = new Date();
            now.setHours(now.getHours() + 1);
            var token = jwt.encode({userId: userId, expires : now}, this.tokenSecret);
            return token;
        }
        else
        {
            console.log('Bad Login');
            return null;
        }
    };

    this.validateLogin = function(user, pass, callback)
    {
        db.collection('users', function(err, collection) 
        {
            if (err)
                callback(err);
            else
            {
                collection.findOne({'user':user}, function(err, item) 
                {
                    if (err)
                        callback(err);
                    else
                    {
                        if (!item)
                            callback("User Name not Found", null);
                        else
                        {
                            crypto.pbkdf2(pass, item.salt, 10000, 512, function(err, hash) 
                            {
                                if (err)
                                    callback(err);
                                else
                                {
                                    if (hash == item.passwordHash)
                                    {
                                        callback(null, item._id);
                                    }
                                    else
                                        callback(null, null);
                                }
                            });
                        }
                    }
                });
            }
        });
        return null;
    };

    this.createLogin = function(name, user, pass, callback)
    {
        db.collection('users', function(err, collection) 
        {
            if (err)
                callback(err);
            else
            {
                collection.findOne({'user':user}, function(err, item) 
                {
                    if (err)
                        callback(err);
                    else
                    {
                        if (item)
                        {
                            callback("User Name used", null);
                        }
                        else
                        {
                            var salt = crypto.randomBytes(128).toString('base64');
                            crypto.pbkdf2(pass, salt, 10000, 512, function(err, hash) 
                            {
                                if (err)
                                    callback(err);
                                else
                                {
                                    var user = {name : name, user : user, passwordHash : hash, salt : salt};
                                    collection.insert(user, {safe:true}, function(err, result) 
                                    {
                                        if (err)
                                            callback(err);
                                        else 
                                        {
                                            console.log('Success: ' + JSON.stringify(result[0]));
                                            callback(null, result[0]);
                                        }
                                    });
                                }
                            });
                        }
                    }
                });                        
            }
        });                        
    };

    this.validateUser = function(token, userId)
    {
        return this.doValidateUser(token, userId) == this.authValid;
    }

    this.doValidateUser = function(token, userId)
    {
        var ret = this.authNone;
        if (token)
        {
            try {
                var dec = jwt.decode(token, this.tokenSecret);
                if (dec == null || (userId && dec.userId != userId))
                    ret = this.authBadToken;
                else 
                    if (Date.now() > dec.expires) 
                        ret = this.authTokenExpired;
                    else
                        ret = this.authValid;
            }
            catch (e) {}
        }
        return ret;
    };
}

module.exports = Auth;