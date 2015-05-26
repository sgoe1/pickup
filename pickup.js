// simple-todos.js
Pevents = new Mongo.Collection("Pevents");

Router.map(function(){
  this.route('about');
  this.route('home', {path: '/'});
});

if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
  pevents: function () {
    if (Session.get("hideCompleted")) {
      // If hide completed is checked, filter Pevents
      return Pevents.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
    } else {
      // Otherwise, return all of the Pevents
      return Pevents.find({}, {sort: {createdAt: -1}});
    }
  },
  hideCompleted: function () {
    return Session.get("hideCompleted");
  },
  incompleteCount: function () {
  return Pevents.find({checked: {$ne: true}}).count();
  },


  });

  Template.body.events({
    "change .hide-completed input": function (event) {
    Session.set("hideCompleted", event.target.checked);
    },
  });

  Template.newPeventForm.events({
  "submit form": function (event) {
    // This function is called when the new pevent form is submitted
    event.preventDefault();

    var text = event.target.text.value;
    var desc = event.target.desc.value;
    var loc = event.target.loc.value;
    var cost = event.target.cost.value;

    console.log(event)


    Pevents.insert({
      text: text,
      desc: desc,
      loc: loc,
      cost: cost,
      interested: [Meteor.user().username],
      createdAt: new Date(), // current time
      owner: Meteor.userId(),           // _id of logged in user
      username: Meteor.user().username
    });

    // Clear form
    event.target.text.value = event.target.desc.value = event.target.loc.value = event.target.cost.value = "";

    // Prevent default form submit
    return false;
  },

  });

  Template.pevent.helpers({
    'selectedClass': function(){
      var peventId = this._id;
      var selectedPevent = Session.get('selectedPevent');
      if(peventId == selectedPevent){
        return 'selected'
      }
    },

  })

  Template.pevent.events({
    "click .toggle-checked": function () {
      // Set the checked property to the opposite of its current value
      Pevents.update(this._id, {$set: {checked: ! this.checked}});
    },
    "click .delete": function () {
      Pevents.remove(this._id);
    },
    "click li": function() {
      Session.set('selectedPevent', this._id);
    },
    "click .interest": function() {
      currPost = Pevents.findOne(this._id);
      if(currPost.interested.indexOf(Meteor.user().username) == -1 ){
        Pevents.update(this._id, {$push: {interested: Meteor.user().username}});
      }
    }

  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}
