(function() {

    var App = function() {
        this.itemdata = {};
        this.interests = [];
    };

    /**
     *  Initialising application
     */
    App.prototype.init = function(el) {
        this.templates = _getTemplates(el);
        this.el = $(el);
        this.regExp = {
            name: '^([A-z]{0,20})$'
        }
        window.location = window.location.hash ? window.location.hash : '#/';
    }

    /**
     * Home entry point.
     */
    App.prototype.home = function() {
        var app = this.resource;
        app.el.html(app.show('home'));
    }

    /**
     * Register page.
     */
    App.prototype.register = function() {
            var app = this.resource;
            app.el.html(app.show('register'));
            app.uploadImage();


            // Events
            $('#interests').on('keyup', function(e) {
                if (e.keyCode == 13) {
                    app.setInterest();
                };
            });

            $('#address').on('change', function() {
                app.address(this.value);
            });

            $('#age').on('change', function() {
                app.age(this.value);
            });

            $('#submit', app.el).on('click', function() {
                var isValid = app.validateFields();

                if (isValid) {
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

                    window.location = '#/profile';

                }
            });

        }
        /**
         * Edit page.
         */
    App.prototype.edit = function() {
        var app = this.resource;
        app.el.html(app.show('register'));
        app.loadProfile();
    }

    App.prototype.loadProfile = function(page) {

        var self = this;
        var localObj = (localStorage.getItem('profileData'));
        self.itemdata = JSON.parse(localObj);

        $('#age', self.el).val(self.itemdata.age);
        $('#firstName', self.el).val(self.itemdata.fname);
        $('#lastName', self.el).val(self.itemdata.lname);
        $('#email', self.el).val(self.itemdata.email);
        $('#phone', self.el).val(self.itemdata.phone);

        var countryVal = $('#country option').filter(function(i, val) {
            return $(val).text() == self.itemdata.country;
        }).val()

        $('#country').val(countryVal);

        var sateVal = $('#state option').filter(function(i, val) {
            return $(val).text() == self.itemdata.state;
        }).val()

        $('#state').val(sateVal);

        $('#homeAddress1', self.el).val(self.itemdata.hadd1);
        $('#homeAddress2', self.el).val(self.itemdata.hadd2);
        $('#companyAddress1', self.el).val(self.itemdata.comadd1);
        $('#companyAddress2', self.el).val(self.itemdata.comadd2);
        $('#subscribe', self.el).is(self.itemdata.subscribe);

        if (self.itemdata.hadd1 !== '') {
            $('#address').val('home');
            $('#addressHome').show();
        }

        if (self.itemdata.comadd1 !== '') {
            $('#address').val('company');
            $('#addressCompany').show();
        }

        this.uploadImage(function() {
            localStorage.setItem('profileData', JSON.stringify(self.itemdata));
        });

        if (this.itemdata.image) {
            var img = new Image();
            img.src = this.itemdata.image;
            $('#holder').html(img);
        }

        self.setInterest();

        // Events
        $('#address').on('change', function() {
            App.prototype.address(this.value);
        });

        $('#interests').on('keyup', function(e) {
            if (e.keyCode == 13) {
                self.setInterest();
            };
        });

        $('#submit').on('click', function() {
            self.itemdata.fname = $('#firstName').val();
            self.itemdata.lname = $('#lastName').val();
            self.itemdata.email = $('#email').val();
            self.itemdata.phone = $('#phone').val();
            self.itemdata.country = $('#country').val() == '' ? '' : $('#country :selected').text();
            self.itemdata.state = $('#state').val() == '' ? '' : $('#state :selected').text();
            self.itemdata.hadd1 = $('#homeAddress1').val();
            self.itemdata.hadd2 = $('#homeAddress2').val();
            self.itemdata.comadd1 = $('#companyAddress1').val();
            self.itemdata.comadd2 = $('#companyAddress2').val();
            self.itemdata.subscribe = $('#subscribe').is(':checked');
            self.itemdata.interests = self.interests;

            localStorage.setItem('profileData', JSON.stringify(self.itemdata));
            window.location = '#/profile';
        });

    }

    /**
     * Profile page.
     */
    App.prototype.profile = function() {
        var app = this.resource;
        app.el.html(app.show('profile'));
        app.setProfile();

        // Events
        $('#uploadLink').on('click', function(e) {
            e.preventDefault();
            $('#fileUpload').trigger('click');
            app.uploadImage(function() {
                localStorage.setItem('profileData', JSON.stringify(app.itemdata));
            });
        });

    }

    App.prototype.setProfile = function(page) {
        var tpl = $('#profile_content').html().split('.'),
            content = '';
        if (!this.itemdata.fname) {
            var localObj = (localStorage.getItem('profileData'));
            this.itemdata = JSON.parse(localObj);
        }

        if (this.itemdata.image) {
            var img = new Image();
            img.src = this.itemdata.image;
            $('#holder').html(img);
        }

        content = tpl[0].replace('{{name}}', this.itemdata.fname + " " + this.itemdata.lname).replace('{{age}}', this.itemdata.age).replace(/{{email}}/ig, this.itemdata.email) + ".";

        if (this.itemdata.state !== '') {
            content += tpl[1].replace('{{state}}', this.itemdata.state) + "."
        }

        if (this.itemdata.interests.length) {
            var intrests = this.itemdata.interests.slice(1);
            var lastItem = intrests.pop();

            content += tpl[2].replace('{{interests}}', intrests.join(',') + ' and ' + lastItem + ".")
        }

        if (this.itemdata.subscribe == true) {
            content += tpl[3].replace('{{newsletter}}', "Please send me the newsletter.")
        }

        if (this.itemdata.phone !== '') {
            content += tpl[4].replace('{{phone}}', this.itemdata.phone + ".")
        }

        $('#profile_content').html(content);

    }

    /**
     * Template rendering based on url.
     */
    App.prototype.show = function(page) {
        var app = this.resource;
        return $(this.templates[page]).html();
    }

    App.prototype.age = function(age) {

        var string = "above 13";

        if (age > 30) {
            string = "above 20"
        }

        if (age > 60) {
            string = "above 30"
        }

        if (age > 90) {
            string = "above 45"
        }

        return string;
    }

    App.prototype.setInterest = function() {

        var val = this.interests.join() + "," + $('#interests').val(),
            valArry = val.split(','),
            tpl = '<span data-value="{{value}}">{{text}} <i>x</i></span>',
            tmpArry = [],
            self = this;

        console.log(this.interests)

        $.each(valArry, function(i, val) {
            if (val !== '') {
                var value = tpl.replace('{{text}}', val).replace('{{value}}', val);
                tmpArry.push(value);
            }
        });

        var tagElems = $('#tags').html(tmpArry.join(''));

        $.each(tagElems.find('i'), function() {
            $(this).on('click', function() {
                $(this).parent().fadeOut();
                var value = $(this).parent().data('value'),
                    itemIndex = self.interests.indexOf(value.toString());
                self.interests.splice(itemIndex, 1);
            })
        });
        self.interests = valArry;
        $('#interests').val('');

        return tmpArry;

    }

    App.prototype.uploadImage = function(fn) {

        var upload = $('#fileUpload')[0],
            holder = $('#holder')[0];

        self = this;

        var fn = fn || function() {};

        isFilereader = typeof window.FileReader !== 'undefined';

        if (isFilereader) {
            upload.onchange = function(e) {
                var file = upload.files[0],
                    reader = new FileReader();

                reader.onload = function(event) {
                    var img = new Image();
                    img.src = event.target.result;
                    holder.innerHTML = '';
                    holder.appendChild(img);
                    self.itemdata.image = event.target.result;
                    fn();
                };
                reader.readAsDataURL(file);

                return false;
            };
        }

    }

    App.prototype.validateFields = function() {

        var elem = $('[required]', this.el),
            self = this,
            errorArry = [];

        $.each(elem, function(i, val) {
            var rule = $(val).data('rule');
            var msg = $(val).data('msg');
            var text = $(val).val();
            var name = val.id;

            if (text == '') {
                errorArry.push(name + ' - empty value not allowed.')
            }

            var regEx = new RegExp(self.regExp[rule]);
            if (!regEx.test(text)) {
                errorArry.push(msg);
            }
        });

        $('#error').html(errorArry.join('<br/>'));

        return !errorArry.length;

    }

    App.prototype.address = function(value) {
        var selection = {
            novalue: function() {
                $('.address').hide('fast');
                $('.address textarea').removeAttr('required');
                $('.address textarea').val('');
            },
            home: function() {
                $('#addressHome').slideDown();
                $('#addressCompany').slideUp();
                $('.address textarea').removeAttr('required');
                $('#addressHome textarea').prop('required', true);
            },
            company: function() {
                $('#addressCompany').slideDown();
                $('#addressHome').slideUp();
                $('.address textarea').removeAttr('required');
                $('#addressCompany textarea').prop('required', true);
            }
        }

        selection[value]();
    }

    /**
     * Sets up Router.
     */
    App.prototype.route = (function() {
        var self = this;
        var routes = {
            '/register': self.register,
            '/': self.home,
            '/profile': self.profile,
            '/edit': self.edit
        }
        var router = Router(routes).configure({
            resource: self
        });
        router.init();
        return this;
    });

    /**
     * Templates.
     */
    function _getTemplates(el) {
        var tplObj = {};
        tplObj.home = $('#tplHome');
        tplObj.profile = $('#tplProfile');
        tplObj.register = $('#tplRegister');
        return tplObj;
    }

    window.App = App;

}())
