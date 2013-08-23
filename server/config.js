Books = new Meteor.Collection("books");
Months = new Meteor.Collection("months");

// if the database is empty on server start, create some sample data.
Meteor.startup(function () {
  if (Months.find().count() === 0) {
    var month_list = [
       {number: "01",
       name: "January"},
       {number: "02",
       name: "February"},
       {number: "03",
       name: "March"},
       {number: "04",
       name: "April"},
       {number: "05",
       name: "May"},
       {number: "06",
       name: "June"},
       {number: "07",
       name: "July"},
       {number: "08",
       name: "August"},
       {number: "09",
       name: "September"},
       {number: "10",
       name: "October"},
       {number: "11",
       name: "November"},
      {number: "12",
       name: "December"},
    ];

    for (var i = 0; i < month_list.length; i++) {
      Months.insert({number:month_list[i].number , name: month_list[i].name});
  	}
  }
});

Meteor.publish("months", function () {
    return Months.find();
  });

Meteor.publish("books", function () {
    return Books.find();
  });

Meteor.publish("allUsers", function () {
  return Meteor.users.find({});
});
