//models
//models contain interactive data and the logic surrounding it: conversions, validations, computed properties and access control.

// intialize - is triggered whenever an instance is created.

// adding an url to all ajax requests. since data in a seperate server.
$.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
  options.url = 'http://backbone-beginner.herokuapp.com' + options.url;
});

	var Person = Backbone.Model.extend({
	// setting model defaults
		defaults: {
			name: 'Human',
			age: 0,
			color: 'white'
		},
		initialize: function(){
			alert('initialized');
			this.on('change:name', function(model){
				var name = model.get('name');				
				alert("my name changed to " + name);
			});
		},
	// adding custom methods
	 	adopt: function(newname){
	 		person.set('name', newname);
	 	}

	});
	
	var person = new Person();
	
	//setting attributes
	var person = new Person({name: 'legiesh', age: 21});
	//or
	person.set({name:'legiesh', age:22});
	person.adopt('japan');
	//getting attributes
	console.log(person.get('name'), person.get('age'), person.get('color'));
	person.set({name:'MM'});
	
	//server interaction
	//models are used to represent data from your server and 
	//actions you perform on them will be converted to RESTful operations
	var userModel = Backbone.Model.extend({
		urlRoot: '/users',
		defaults: {
			firstname: '',
			lastname: '',
			age: 0
		}
	});	

	var user = new userModel();

	var userDetails = {
		firstname: 'Tim',
		lastname: 'oliver',
		age: 22
	};

	user.save(userDetails, {
		success: function(data){
			console.log(data);
		}
	});
	