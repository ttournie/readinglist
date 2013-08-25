Meteor.users.allow({
  insert: function(userId, doc){
    return true;
  }
, update: function(userId, doc, fields, modifier){
    return true;
  }
, remove: function(userId, doc){
    return isAdminById(userId) || (doc._id && doc._id === userId);
  }
});

Accounts.onCreateUser(function (options, user) {
	return user;
});