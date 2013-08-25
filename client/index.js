	Hooks.init();
	Books = new Meteor.Collection("books");
	Months = new Meteor.Collection("months");

	// Month
	Meteor.subscribe("months", [], function () {
	  console.log("[subscription complete]");
	});

	// Books
	Meteor.subscribe("books", [], function () {
	  console.log("[subscription complete 2 ]");
	});

	// All users
	Meteor.subscribe("allUsers", [], function () {
	  console.log("[subscription complete 3 ]");
	});

	// Set the user in session
	function setUser(context, page) {
		var _id = context.params._id;
		Session.set("user", Meteor.users.findOne(_id));
	}

	// Routing
	Meteor.pages({
	    '/': { to: 'index' },
	    '/users': { to: 'user_list' },
	    '/users/:_id': { to: 'user_show_reading_list', before: setUser },
  	});

  	// Redirectiong Hook on loggin
	Hooks.onLoggedIn = function () {
		if(Meteor.user().services.twitter) {
			var twitterInfo =  Meteor.user().services.twitter;
			Meteor.users.update({ _id:Meteor.userId() }, {$set :{"username":twitterInfo.screenName}});
			Meteor.users.update({ _id:Meteor.userId() }, {$set :{"avatar":twitterInfo.profile_image_url}});
		}
		Meteor.user()._id
		Meteor.Router.to('/users/' + Meteor.user()._id);
	};

	// Get the user in session
  	Template.user_show_reading_list.helpers({
  		user: function() {
  			return Session.get("user");
  		}
  	});

  	// Logout Template event
	Template.user_loggedout.events({
	    'click #login' : function (e, tmpl) {
	    	 Meteor.loginWithPassword({username:username}, password, function(err){
		        if (err) {
		          console.log(err);
		        }
	    	 });
	    }
	});

	// Login Template event
    Template.user_loggedin.events({
	    'click #logout' : function (e, tmpl) {
	    	 Meteor.logout(function (err){
	    	 	if (err) {
		          console.log(err);
		        } else {

		        }

		    });
		}
	});

    // Adding a new book in reading list
	Template.reading_list_add.events({
		'submit' : function() {
		    event.preventDefault();
		    var title = $("input[name$='title']").val();
		    var author = $("input[name$='author']").val();
		    // Get the current date
		    var fullDate = new Date();
		    var twoDigitMonth = ((fullDate.getMonth().length+1) === 1)? (fullDate.getMonth()+1) : '0' + (fullDate.getMonth()+1);
			var currentDate = fullDate.getDate() + "/" + twoDigitMonth + "/" + fullDate.getFullYear();
			// Testing if the title is not empty befor updating the database
			if(title != '') {
				Books.insert({user: Meteor.user()._id, name: title, author: author, day: fullDate.getDate(), month: twoDigitMonth, year: fullDate.getFullYear()});
			}
			$("input[name$='title']").val('');
		    $("input[name$='author']").val('');
	}});

	// Removing a book from user reading list
	Template.user_books.events({
		'click .remove_book' : function() {
			if(Meteor.user()._id == this.user) {
				Books.remove(this._id);
			}
	}});

	Template.user_loggedin.user = function() {
  		return Meteor.user().username;
	}

	Template.user_list.users = function() {
  		return Meteor.users.find();
	}

	Template.reading_list_add.user = function() {
  		return Meteor.user().username;
	}

	Template.user_loggedin.avatar = function() {
		if( Meteor.user().avatar) {
  			return Meteor.user().avatar;
  		}
	}

	// Retrieving all the user book and sorting them by month
	Template.user_reading_list.month = function() {
		var user = Session.get("user");
		var _id = user._id;
		// Get all the month and year of user's books
		var books = Books.find({user: _id }, {sort: {year: -1, month: -1}});
		var i = 0
		var month = new Array();
		var month_year = new Array();
		books.forEach(function(book) {
			month_year[i] = book.month + '/' + book.year;
			i++;
		});
		var month_year=month_year.filter(function(itm,i,a){
    		return i==a.indexOf(itm);
		});
		var month_books_object = new Array()

		// For each month/year create an object with all the books of this month/year
		for(i=0; i<month_year.length; i++) {
			var split_date = month_year[i].split("/");
			var month_book = Books.find({user: _id , month: split_date[0], year: parseInt(split_date[1])}, {day: -1, year: -1, month: -1}).fetch();
			var month_string = Months.findOne({number: split_date[0]});
			var nb_book = Books.find({user: _id , month: split_date[0], year: parseInt(split_date[1])}, {day: -1, year: -1, month: -1}).count();
			month_books_object[i] = {mois : month_string.name, count: nb_book , books: month_book};
		}

  		return month_books_object;
	}

	// Return true if the user in session is the logged user
	Template.user_reading_list.mylist = function() {
		var mylist = 'TRUE';
		if(Meteor.user()) {
			// If the current logged user as the same id as the reading list user
			if(Session.get("user")._id == Meteor.user()._id) {
				return mylist;
			}
		}
	}

	// Return true if the user in session is the logged user
	Template.user_books.mylist = function() {
		var mylist = 'TRUE';
		if(Meteor.user()) {
			// If the current logged user as the same id as the reading list user
			if(Session.get("user")._id == Meteor.user()._id) {
				return mylist;
			}
		}
	}