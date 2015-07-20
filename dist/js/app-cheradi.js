(function(){

  var App = function(){
    this.itemdata = {};
    this.interests = [];
  };

  App.prototype.init = function(el){
    this.templates = _getTemplates(el);
    this.el = $(el);
    this.regExp = {
      name: '^([A-z]{0,20})$'
    }
    window.location = window.location.hash ? window.location.hash : '#/';
  }

  App.prototype.home = function(){
    console.log(this); // router object
    var app = this.resource;
    app.el.html(app.show('home'));
  }

  App.prototype.register = function(){
    var app = this.resource;
    app.el.html(app.show('register'));
    app.uploadImage();
    app.getCountryState();

    // Events
    $('#interests').on('keyup', function(e){
      if(e.keyCode == 13){
        app.setInterest();
      };
    });

    $('#address').on('change', function(){
      app.address(this.value);
    });

    $('#age').on('change', function(){
      app.age(this.value);
    });

    $('#country').on('change', function(){
      app.getSate(this.value);
    });

    $('#submit', app.el).on('click', function(){
      var isValid = app.validateFields();

      if(isValid){
        app.itemdata.age = app.age($('#age', app.el).val());
        app.itemdata.fname = $('#firstName', app.el).val();
        app.itemdata.lname = $('#lastName', app.el).val();
        app.itemdata.email = $('#email', app.el).val();
        app.itemdata.phone = $('#phone', app.el).val();
        app.itemdata.country = $('#country', app.el).val() == '' ? '' : $('#country :selected').text();
        app.itemdata.state = $('#state', app.el).val() == '' ? '' : $('#state :selected').text();
        app.itemdata.hadd1 = $('#homeAddress1', app.el).val();
        app.itemdata.hadd2 = $('#homeAddress2', app.el).val();
        app.itemdata.comadd1 = $('#companyAddress1', app.el).val();
        app.itemdata.comadd2 = $('#companyAddress2', app.el).val();
        app.itemdata.subscribe = $('#subscribe', app.el).is(':checked');
        app.itemdata.interests = app.interests;

        localStorage.setItem('profileData', JSON.stringify(app.itemdata));

        console.log(app.itemdata)

        window.location = '#/profile';

      }
    });

  }

  App.prototype.edit = function(){
    var app = this.resource;
    app.el.html(app.show('edit'));
  }

  App.prototype.profile = function(){
    var app = this.resource;
    app.el.html(app.show('profile'));
    app.setProfile();
  }

  App.prototype.setProfile = function(page){
    // console.log(this.itemdata)
    var tpl = $('#profile_content').html().split('.'),
        content = '';

        // console.log($('#profile_content').html().split('.'))

        if(!this.itemdata.fname){
          var localObj = (localStorage.getItem('profileData'));
          this.itemdata = JSON.parse(localObj);
          // console.log(this.itemdata);
        }

    if(this.itemdata.image){
      var img = new Image();
      img.src = this.itemdata.image;
      $('#holder').html(img);
    }

    content = tpl[0].replace('{{name}}', this.itemdata.fname + " " + this.itemdata.lname).replace('{{age}}', this.itemdata.age).replace(/{{email}}/ig, this.itemdata.email)+".";

    if(this.itemdata.state !== ''){
      content += tpl[1].replace('{{state}}', this.itemdata.state) + "."
    }

    if(this.itemdata.interests.length){
      var intrests = this.itemdata.interests.slice(1);
      var lastItem = intrests.pop();

      content += tpl[2].replace('{{interests}}', intrests.join(',') + ' and ' + lastItem + ".")
    }

    if(this.itemdata.subscribe == true){
      content += tpl[3].replace('{{newsletter}}', "Please send me the newsletter.")
    }

    if(this.itemdata.phone !== ''){
      content += tpl[4].replace('{{phone}}', this.itemdata.phone+".")
    }

    $('#profile_content').html(content);

  }

  App.prototype.show = function(page){
    var app = this.resource;
    return $(this.templates[page]).html();
  }

  App.prototype.age = function(age){

    var string = "Above 13";

    if(age > 30){
      string = "Above 20"
    }

    if(age > 60){
      string = "Above 30"
    }

    if(age > 90){
      string = "Above 45"
    }

    return string;
  }

  App.prototype.getSate = function(code){
    var state = $('#state');
    var tpl = '<option value="{{val}}">{{name}}</option>';
    var tmpStae = [];
    tmpStae.push  ('<option value="">Select state</option>');

    $.each(this.counrtyJSON, function(i, val){
      if(val.v == code){
        $.each(val.s, function(index, value){
          tmpStae.push(
            tpl.replace('{{val}}', value.v)
               .replace('{{name}}', value.n))
        });

        state.html(tmpStae.join(''));
      }
    })
  }

  App.prototype.getCountryState = function(){
    var country = $('#country');
    var tpl = '<option value="{{val}}">{{name}}</option>';
    var url = window.location.origin + '/js/vendor/states.json';
    var countryArry = [];
    var self = this;

    var countryObj = $.ajax(url, {dataType: 'json'});

    countryObj.done(function(data){
      self.counrtyJSON = data;
      $.each(data, function(i, val){
        countryArry.push(
          tpl.replace('{{val}}', val.v)
             .replace('{{name}}', val.n)
          )
      });
      country.append(countryArry.join(''));
    })

  }

  App.prototype.setInterest = function(){
    var val = this.interests.join() +","+ $('#interests').val(),
        valArry = val.split(','),
        tpl = '<span data-value="{{value}}">{{text}} <i>x</i></span>',
        tmpArry = [],
        self = this;

        $.each(valArry, function(i, val){
          isVal = val === '' ? false : true;
          if(isVal){
            var value = tpl.replace('{{text}}', val).replace('{{value}}', val);
            tmpArry.push(value);
          }
        });

        var tagElems = $('#tags').html(tmpArry.join(''));

        $.each(tagElems.find('i'), function(e){
          $(this).on('click', function(ev){
            $(this).parent().fadeOut();
            var value = $(this).parent().data('value'),
                itemIndex = self.interests.indexOf(value.toString());
                self.interests.splice(itemIndex, 1);
          })
        });
        self.interests = valArry;
        $('#interests').val('');

  }

  App.prototype.uploadImage = function(){
    var upload = document.getElementById('fileUpload'),
        holder = document.getElementById('holder'),
        self = this;

        isFilereader = typeof window.FileReader !== 'undefined';

        if(isFilereader){
          upload.onchange = function(e){
            //e.preventDefault();
             console.log(this.files);

            var file = upload.files[0],
                reader = new FileReader();

            reader.onload = function (event) {
              var img = new Image();
              img.src = event.target.result;
              holder.innerHTML = '';
              holder.appendChild(img);
              self.itemdata.image = event.target.result;
            };
            reader.readAsDataURL(file);

            return false;
          };
        }

  }
  App.prototype.validateFields = function(){

    var elem = $('[required]', this.el),
        self = this,
        errorArry = [];

    $.each(elem, function(i, val){
      var rule = $(val).data('rule');
      var msg = $(val).data('msg');
      var text = $(val).val();
      var name = val.id;

      if(text == ''){
        errorArry.push(name + ' Empty value not allowed.')
      }

      var regEx = new RegExp(self.regExp[rule]);
      if(!regEx.test(text)){
        errorArry.push(msg);
      }
    });

    $('#error').html(errorArry.join('<br/>'));

    return !errorArry.length;

  }
  App.prototype.address = function(value){
    var selection = {
        novalue: function(){
          $('.address').hide('fast');
        },
        home: function(){
          $('#addressHome').show('slow');
          $('#addressCompany').hide('fast');
        },
        company: function(){
          $('#addressCompany').show('slow');
          $('#addressHome').hide('fast');
        }
    }

    selection[value]();
  }

  /**
	 * Sets up Router.
	 */
  App.prototype.route = (function(){
    var self = this;
    // console.log(this)
    var routes = {
        '/register': self.register,
        '/': self.home,
        '/profile': self.profile,
        '/edit': self.edit
      }
      var router = Router(routes).configure({ resource: self });
      router.init();
      return this;
  })

  /**
	 * Templates.
	 */
  function _getTemplates(el){
    var tplObj = {};
    tplObj.home = $('#tplHome');
    tplObj.profile = $('#tplProfile');
    tplObj.register = $('#tplRegister');
    return tplObj;
  }

  window.App = App;

}())
