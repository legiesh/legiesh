$.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
  options.url = 'http://backbone-beginner.herokuapp.com' + options.url;
});

//to convert form data into objects. uses jQuery serializeArray() method to convert form into objects.
$.fn.serializeObject = function() {
  var o = {};
  var a = this.serializeArray();
  $.each(a, function() {
      if (o[this.name] !== undefined) {
          if (!o[this.name].push) {
              o[this.name] = [o[this.name]];
          }
          o[this.name].push(this.value || '');
      } else {
          o[this.name] = this.value || '';
      }
  });
  return o;
};

var Users = Backbone.Collection.extend({
	url: '/users'
});

var User = Backbone.Model.extend({
	urlRoot: '/users'
});

var UserList = Backbone.View.extend({
	
	el:'.page',
	render: function(){			
		var that = this;
		var users = new Users();
		users.fetch({
			success: function(users){
				var template = _.template($('#user-list-template').html(), {users: users.models});
				that.$el.html(template);
			}
		});
	}
});

var EditUser = Backbone.View.extend({
	el: '.page',
	render: function(options){
		var that = this;
		if(options.id){
			//GET request
			that.user = new User({id: options.id});
			that.user.fetch({
				success: function(user){
					var template = _.template($('#edit-user-template').html(), {user: user});
					that.$el.html(template);			
				}
			});
		}else{
			var template = _.template($('#edit-user-template').html(), {user: null});
			this.$el.html(template);			
		}
		
	},
	events: {
		'submit .edit-user-form': 'saveUser',
		'click .delete': 'deleteUser'
	},
	saveUser: function(ev){
		var userDetails = $(ev.currentTarget).serializeObject();
		var user = new User();
		user.save(userDetails, {
			success: function(user){
				//console.log(user);
				router.navigate('', {trigger: true});
			}
		});
		//console.log(userDetails);
		return false;
	},
	deleteUser: function(ev){
		this.user.destroy({
			success: function(){
				router.navigate('', {trigger:true});
			}
		});
	}
});

var Router = Backbone.Router.extend({
	routes: {
		'': 'home',
		'new': 'editUser',
		'edit/:id': 'editUser'
	}
});


var router = new Router();
var userList = new UserList();
router.on('route:home', function(){
	//console.log('hey');
	userList.render();
});
var editUser = new EditUser();
router.on('route:editUser', function(id){
	editUser.render({id: id});	
});

Backbone.history.start();