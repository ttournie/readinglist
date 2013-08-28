function preg_replace (array_pattern, array_pattern_replace, my_string) {
	var new_string = String (my_string);
	for (i=0; i<array_pattern.length; i++) {
		var reg_exp= RegExp(array_pattern[i], "gi");
		var val_to_replace = array_pattern_replace[i];
		new_string = new_string.replace (reg_exp, val_to_replace);
	}
	return new_string;
}

function no_accent (my_string) {
	var new_string = "";
	var pattern_accent = new Array("é", "è", "ê", "ë", "ç", "à", "â", "ä", "î", "ï", "ù", "ô", "ó", "ö");
	var pattern_replace_accent = new Array("e", "e", "e", "e", "c", "a", "a", "a", "i", "i", "u", "o", "o", "o");
	if (my_string && my_string!= "") {
		new_string = preg_replace (pattern_accent, pattern_replace_accent, my_string);
	}
	return new_string;
}

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
	var safename = no_accent(user.username);
	safename = safename.replace(/ /g, '.');
	user.safename = safename;
	user.avatar = '../profile50.jpg';
	return user;
});