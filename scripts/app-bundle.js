define('about',["require", "exports"], function (require, exports) {
    "use strict";
    var About = (function () {
        function About() {
        }
        return About;
    }());
    exports.About = About;
});

define('services/application',["require", "exports"], function (require, exports) {
    "use strict";
    var ApplicationService = (function () {
        function ApplicationService() {
            this.loading = false;
        }
        return ApplicationService;
    }());
    exports.ApplicationService = ApplicationService;
});

define('common',["require", "exports"], function (require, exports) {
    "use strict";
    exports.colours = [
        'bg--purple',
        'bg--grapefruit',
        'bg--medium-blue',
        'bg--bright-blue',
        'bg--gentle-pink',
        'bg--teal',
        'bg--light-cyan',
        'bg--brave-orange',
        'bg--yellow-its-me',
        'bg--green',
        'bg--pie',
        'bg--middle-blue'
    ];
    exports.getColourFromHashedString = function (str) {
        if (str) {
            var hash = exports.hashString(str);
            var index = hash % exports.colours.length;
            return exports.colours[index];
        }
        return null;
    };
    exports.hashString = function (str) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            var charCode = str.charCodeAt(i);
            hash += charCode;
        }
        return hash;
    };
    exports.paginate = function (page, maxPerPage, items) {
        var offset = (page - 1) * maxPerPage;
        var totalPages = Math.ceil(items.length / maxPerPage);
        return {
            items: (maxPerPage === -1) ? items : items.slice(offset, offset + maxPerPage),
            pages: totalPages
        };
    };
    exports.slugify = function (str) {
        return str.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };
    exports.categories = [
        { name: 'Website', value: 'website', selected: true },
        { name: 'Plugin', value: 'plugin' },
        { name: 'Mobile Application', value: 'mobile' },
        { name: 'Theme', value: 'theme' }
    ];
    exports.scrollTop = function () {
        window.scrollTo(0, 0);
    };
    exports.isEmpty = function (str) {
        return typeof str === 'string' && str.trim() === '';
    };
    exports.notEmpty = function (str) {
        return typeof str === 'string' && str.trim() !== '';
    };
    exports.stringInObject = function (str, obj) {
        return typeof str === 'string' && obj && str in obj || false;
    };
    exports.isUrl = function (str) {
        return typeof str === 'string' && (str.indexOf('http:') >= 0 || str.indexOf('https:') >= 0) || false;
    };
    exports.requiredField = function (field, map) {
        return field && map && map.indexOf(field) >= 0 || false;
    };
    exports.equals = function (a, b) {
        return a === b;
    };
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('api',["require", "exports", 'aurelia-framework', 'aurelia-fetch-client', './services/application', './common'], function (require, exports, aurelia_framework_1, aurelia_fetch_client_1, application_1, common_1) {
    "use strict";
    var Api = (function () {
        function Api(http, appService) {
            this.http = http;
            this.appService = appService;
        }
        Api.prototype.getProjectsFromFirebase = function () {
            var _this = this;
            this.appService.loading = true;
            return new Promise(function (resolve, reject) {
                firebase.database().ref('submissions').once('value').then(function (snapshot) {
                    _this.appService.loading = false;
                    resolve(snapshot.val());
                }, function () {
                    _this.appService.loading = false;
                });
            });
        };
        Api.prototype.castVote = function (name, action) {
            var slug = common_1.slugify(name);
            if (action === 'add') {
                return firebase.database().ref("submissions/" + slug + "/votes/" + firebase.auth().currentUser.uid).set(true);
            }
            else {
                return firebase.database().ref("submissions/" + slug + "/votes/" + firebase.auth().currentUser.uid).set(null);
            }
        };
        Api.prototype.addProject = function (project) {
            if (!project.added) {
                project.added = firebase.database.ServerValue.TIMESTAMP;
            }
            firebase.database().ref("submissions/" + common_1.slugify(project.name)).update(project);
        };
        Api.prototype.postSubmission = function (submission) {
            return new Promise(function (resolve, reject) {
                if (submission && firebase.auth().currentUser) {
                    submission._uid = firebase.auth().currentUser.uid;
                    submission.added = firebase.database.ServerValue.TIMESTAMP;
                    firebase.database().ref("submissions/" + common_1.slugify(submission.name)).set(submission).then(function () {
                        resolve(true);
                    });
                }
            });
        };
        Api = __decorate([
            aurelia_framework_1.autoinject, 
            __metadata('design:paramtypes', [aurelia_fetch_client_1.HttpClient, application_1.ApplicationService])
        ], Api);
        return Api;
    }());
    exports.Api = Api;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('services/user',["require", "exports", 'aurelia-framework'], function (require, exports, aurelia_framework_1) {
    "use strict";
    var UserService = (function () {
        function UserService() {
            var _this = this;
            this.userLoggedIn = false;
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    _this.userLoggedIn = true;
                }
                else {
                    _this.userLoggedIn = false;
                }
            });
        }
        UserService.prototype.login = function (email, password) {
            return new Promise(function (resolve, reject) {
                firebase.auth().signInWithEmailAndPassword(email, password)
                    .then(function () {
                    resolve(true);
                })
                    .catch(function (error) {
                    reject(error);
                });
            });
        };
        UserService.prototype.register = function (email, password) {
            return new Promise(function (resolve, reject) {
                firebase.auth().createUserWithEmailAndPassword(email, password)
                    .then(function () {
                    resolve(true);
                })
                    .catch(function (error) {
                    reject(error);
                });
            });
        };
        Object.defineProperty(UserService.prototype, "isLoggedIn", {
            get: function () {
                return this.userLoggedIn;
            },
            enumerable: true,
            configurable: true
        });
        UserService.prototype.getLoggedInUser = function () {
            return firebase.auth().currentUser;
        };
        UserService.prototype.logout = function () {
            return firebase.auth().signOut();
        };
        __decorate([
            aurelia_framework_1.computedFrom('userLoggedIn'), 
            __metadata('design:type', Object)
        ], UserService.prototype, "isLoggedIn", null);
        UserService = __decorate([
            aurelia_framework_1.autoinject, 
            __metadata('design:paramtypes', [])
        ], UserService);
        return UserService;
    }());
    exports.UserService = UserService;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('app',["require", "exports", 'aurelia-framework', 'aurelia-event-aggregator', './api', './services/application', './services/user', './common'], function (require, exports, aurelia_framework_1, aurelia_event_aggregator_1, api_1, application_1, user_1, common_1) {
    "use strict";
    var App = (function () {
        function App(api, appService, userService, ea) {
            this.showHat = false;
            this.showHatLogin = false;
            this.showHatRegister = false;
            this.showHatSubmission = false;
            this.model = {
                email: '',
                password: '',
                password2: '',
                name: '',
                category: 'website',
                url: '',
                repoUrl: '',
                description: '',
                twitterHandle: ''
            };
            this.disableButtons = false;
            this.formMessage = '';
            this.validationErrors = {};
            this.api = api;
            this.appService = appService;
            this.userService = userService;
            this.ea = ea;
            this.categories = common_1.categories;
        }
        Object.defineProperty(App.prototype, "loginFormIsValid", {
            get: function () {
                return (common_1.notEmpty(this.model.email) && common_1.notEmpty(this.model.password));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App.prototype, "registerFormIsValid", {
            get: function () {
                return (common_1.notEmpty(this.model.email) && common_1.notEmpty(this.model.password) && common_1.notEmpty(this.model.password2) && this.passwordsMatch);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App.prototype, "submissionFormIsValid", {
            get: function () {
                var isValid = true;
                if (common_1.isEmpty(this.model.name) || common_1.isEmpty(this.model.category) || common_1.isEmpty(this.model.description)) {
                    isValid = false;
                }
                if (common_1.notEmpty(this.model.url) && !common_1.isUrl(this.model.url)) {
                    isValid = false;
                }
                if (common_1.notEmpty(this.model.repoUrl) && !common_1.isUrl(this.model.repoUrl)) {
                    isValid = false;
                }
                if (common_1.notEmpty(this.model.twitterHandle) && this.model.twitterHandle.charAt(0) === '@') {
                    this.model.twitterHandle.substring(1);
                }
                if (common_1.isEmpty(this.model.url) && common_1.isEmpty(this.model.repoUrl)) {
                    isValid = false;
                }
                return isValid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App.prototype, "passwordsMatch", {
            get: function () {
                return ((common_1.notEmpty(this.model.password) && common_1.notEmpty(this.model.password2)) && (common_1.equals(this.model.password.trim(), this.model.password2.trim())));
            },
            enumerable: true,
            configurable: true
        });
        App.prototype.attached = function () {
            var _this = this;
            this.ea.subscribe('show.login-form', function () {
                _this.login();
            });
            this.ea.subscribe('submission', function () {
                _this.submission();
            });
        };
        App.prototype.configureRouter = function (config, router) {
            config.title = 'Built With Aurelia';
            config.map([
                {
                    route: '',
                    moduleId: './home',
                    name: 'home',
                    nav: false,
                    title: 'Home'
                },
                {
                    route: 'about',
                    moduleId: './about',
                    name: 'about',
                    nav: true,
                    title: 'About'
                },
                {
                    route: 'feed',
                    moduleId: './feed',
                    name: 'feed',
                    nav: true,
                    title: 'RSS Feed'
                }
            ]);
            this.router = router;
        };
        App.prototype.closeHat = function () {
            this.formMessage = '';
            this.showHat = false;
            this.showHatLogin = false;
            this.showHatRegister = false;
            this.showHatSubmission = false;
        };
        App.prototype.login = function ($event) {
            this.formMessage = '';
            this.model.email = '';
            this.model.password = '';
            this.showHat = true;
            this.showHatRegister = false;
            this.showHatLogin = true;
        };
        App.prototype.logout = function ($event) {
            this.formMessage = '';
            this.userService.logout();
            window.location.reload();
        };
        App.prototype.register = function ($event) {
            this.formMessage = '';
            this.model.email = '';
            this.model.password = '';
            this.model.password2 = '';
            this.showHat = true;
            this.showHatLogin = false;
            this.showHatRegister = true;
        };
        App.prototype.submission = function ($event) {
            this.model.name = '';
            this.formMessage = '';
            this.showHat = true;
            if (this.userService.isLoggedIn) {
                this.showHatLogin = false;
                this.showHatRegister = false;
                this.showHatSubmission = true;
            }
            else {
                this.showHatLogin = true;
                this.formMessage = 'You need to be logged in to make a new submission.';
            }
        };
        App.prototype.handleLogin = function ($event) {
            var _this = this;
            if (this.loginFormIsValid) {
                this.formMessage = '';
                this.disableButtons = true;
                this.userService.login(this.model.email, this.model.password)
                    .then(function () {
                    _this.showHat = false;
                    _this.showHatRegister = false;
                    _this.showHatLogin = false;
                    window.location.reload();
                })
                    .catch(function (e) {
                    if (e.code === 'auth/user-not-found') {
                        _this.formMessage = 'Ow, there was a problem :(<br>Please make sure you have entered a valid email address and password, then try again.';
                    }
                });
            }
        };
        App.prototype.handleRegister = function ($event) {
            var _this = this;
            if (this.registerFormIsValid) {
                this.formMessage = '';
                this.disableButtons = true;
                this.userService.register(this.model.email, this.model.password)
                    .then(function () {
                    _this.showHat = false;
                    _this.showHatRegister = false;
                    _this.showHatLogin = true;
                    window.location.reload();
                })
                    .catch(function (e) {
                    _this.formMessage = 'Sorry :(<br>there was a problem registering. Please make sure you entered in all fields correctly or refreshing the page.';
                });
            }
        };
        App.prototype.handleSubmission = function ($event) {
            var _this = this;
            if (this.submissionFormIsValid) {
                this.formMessage = '';
                this.disableButtons = true;
                var submissionObject = {
                    name: this.model.name,
                    category: this.model.category,
                    description: this.model.description
                };
                if (common_1.notEmpty(this.model.url)) {
                    submissionObject.url = this.model.url;
                }
                if (common_1.notEmpty(this.model.repoUrl)) {
                    submissionObject.repoUrl = this.model.repoUrl;
                }
                if (common_1.notEmpty(this.model.twitterHandle)) {
                    submissionObject.twitterHandle = this.model.twitterHandle;
                }
                this.api.postSubmission(submissionObject)
                    .then(function () {
                    window.alert('Your submission has been received, thank you');
                    _this.disableButtons = false;
                    _this.showHat = false;
                    _this.showHatSubmission = false;
                });
            }
        };
        App.prototype.showHatChanged = function (bool) {
            if (bool) {
                common_1.scrollTop();
            }
        };
        __decorate([
            aurelia_framework_1.observable, 
            __metadata('design:type', Boolean)
        ], App.prototype, "showHat", void 0);
        __decorate([
            aurelia_framework_1.computedFrom('model.email', 'model.password'), 
            __metadata('design:type', Object)
        ], App.prototype, "loginFormIsValid", null);
        __decorate([
            aurelia_framework_1.computedFrom('model.email', 'model.password', 'model.password2'), 
            __metadata('design:type', Object)
        ], App.prototype, "registerFormIsValid", null);
        __decorate([
            aurelia_framework_1.computedFrom('model.name', 'model.category', 'model.url', 'model.repoUrl', 'model.description', 'model.twitterHandle'), 
            __metadata('design:type', Object)
        ], App.prototype, "submissionFormIsValid", null);
        __decorate([
            aurelia_framework_1.computedFrom('model.password', 'model.password2'), 
            __metadata('design:type', Object)
        ], App.prototype, "passwordsMatch", null);
        App = __decorate([
            aurelia_framework_1.autoinject, 
            __metadata('design:paramtypes', [api_1.Api, application_1.ApplicationService, user_1.UserService, aurelia_event_aggregator_1.EventAggregator])
        ], App);
        return App;
    }());
    exports.App = App;
});

define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('feed',["require", "exports", 'aurelia-framework', './api', './common'], function (require, exports, aurelia_framework_1, api_1, common_1) {
    "use strict";
    var Feed = (function () {
        function Feed(api) {
            this.items = [];
            this.api = api;
        }
        Feed.prototype.attached = function () {
            this.fetchItems().then(function (items) {
                document.write("<?xml version=\"1.0\" encoding=\"utf-8\"?>\n                <rss version=\"2.0\">\n                    <channel>\n                        <title>Built With Aurelia</title>\n                        <link>http://builtwithaurelia.com/</link>\n                        <description>Latest submissions added to Built With Aurelia.</description>\n                        " + items + "\n                    </channel>\n                </rss>");
            });
        };
        Feed.prototype.fetchItems = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.api.getProjectsFromFirebase().then(function (projects) {
                    if (projects) {
                        for (var project in projects) {
                            var actualProject = projects[project];
                            _this.items.push(_this.createItem(actualProject.name, 'builtwithaurelia.com', "builtwithaurelia.com/" + common_1.slugify(actualProject.name), '', actualProject.description));
                        }
                        resolve(_this.items.join(''));
                    }
                });
            });
        };
        Feed.prototype.createItem = function ($title, $link, $guid, $pubDate, $description) {
            return "\n            <item>\n                <title>" + $title + "</title>\n                <link>" + $link + "</link>\n                <guid>" + $guid + "</guid>\n                <pubDate>" + $pubDate + "</pubDate>\n                <description>" + $description + "</description>\n            </item>\n        ";
        };
        Feed = __decorate([
            aurelia_framework_1.autoinject, 
            __metadata('design:paramtypes', [api_1.Api])
        ], Feed);
        return Feed;
    }());
    exports.Feed = Feed;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('home',["require", "exports", 'aurelia-framework', 'aurelia-event-aggregator', 'aurelia-router', './api', './services/user', './common'], function (require, exports, aurelia_framework_1, aurelia_event_aggregator_1, aurelia_router_1, api_1, user_1, common_1) {
    "use strict";
    var Home = (function () {
        function Home(api, appService, ApplicationService, userService, ea, router) {
            this.currentCategory = null;
            this.categories = {
                all: { name: 'All', value: '', count: 0 },
                mobile: { name: 'Mobile', value: 'mobile', count: 0 },
                plugin: { name: 'Plugins', value: 'plugin', count: 0 },
                theme: { name: 'Themes', value: 'theme', count: 0 },
                website: { name: 'Websites', value: 'website', count: 0 }
            };
            this.projects = [];
            this.backupProjects = [];
            this.currentPage = 1;
            this.totalNumberOfPages = -1;
            this.currentSortMode = 'popular';
            this.api = api;
            this.appService = appService;
            this.userService = userService;
            this.ea = ea;
            this.router = router;
        }
        Home.prototype.canActivate = function (params) {
            var _this = this;
            var projectsPromise = new Promise(function (resolve, reject) {
                _this.api.getProjectsFromFirebase().then(function (projects) {
                    for (var key in projects) {
                        var project = projects[key];
                        if (typeof project.votes !== 'undefined') {
                            if (firebase.auth().currentUser) {
                                if (firebase.auth().currentUser.uid in project.votes) {
                                    project.currentUserHasVotedFor = true;
                                }
                            }
                            project.votes = Object.keys(project.votes).length;
                        }
                        else {
                            project.votes = 0;
                        }
                        _this.projects.push(project);
                    }
                    resolve(projects);
                });
            });
            return Promise.all([projectsPromise]);
        };
        Home.prototype.activate = function () {
            this.projects.sort(function (a, b) {
                return parseInt(b.votes, 10) - parseInt(a.votes, 10) || a.added - b.added;
            });
            this.getProjectCounts();
            this.currentCategory = this.categories.all;
        };
        Home.prototype.submission = function ($event) {
            this.ea.publish('submission');
        };
        Home.prototype.getProjectCounts = function () {
            if (this.projects.length) {
                for (var i = 0; i < this.projects.length; i++) {
                    var item = this.projects[i];
                    if (item && item.category) {
                        var navItem = this.categories[item.category];
                        if (navItem) {
                            navItem.count += 1;
                        }
                    }
                }
                this.categories.all.count = this.projects.length;
            }
        };
        Home.prototype.getRandomBackgroundColour = function (name) {
            return common_1.getColourFromHashedString(name);
        };
        Home.prototype.sortBy = function (type) {
            this.currentSortMode = type;
            if (type === 'popular') {
                this.sortByPopular();
            }
            else if (type === 'new') {
                this.sortByNewlyAdded();
            }
        };
        Home.prototype.sortByPopular = function () {
            this.projects.sort(function (a, b) {
                return parseInt(b.votes, 10) - parseInt(a.votes, 10) || a.added - b.added;
            });
        };
        Home.prototype.sortByNewlyAdded = function () {
            this.projects.sort(function (a, b) {
                return b.added - a.added;
            });
        };
        Home.prototype.filterCategory = function (category) {
            this.currentCategory = category;
            if (!this.backupProjects.length) {
                this.backupProjects = this.projects.slice(0);
            }
            if (category.value !== '') {
                this.projects = this.backupProjects.filter(function (project) {
                    return project.category === category.value;
                });
            }
            else {
                this.projects = this.backupProjects;
            }
        };
        Home.prototype.vote = function (evt, name) {
            if (this.userService.isLoggedIn) {
                var voteAction = 'add';
                this.projects.map(function (project) {
                    if (common_1.slugify(project.name) === common_1.slugify(name)) {
                        if (project.currentUserHasVotedFor) {
                            project.votes--;
                            project.currentUserHasVotedFor = false;
                            voteAction = 'remove';
                        }
                        else {
                            project.votes++;
                            project.currentUserHasVotedFor = true;
                        }
                    }
                    return project;
                });
                this.api.castVote(name, voteAction);
            }
            else {
                this.ea.publish('show.login-form');
            }
        };
        Home = __decorate([
            aurelia_framework_1.autoinject, 
            __metadata('design:paramtypes', [api_1.Api, Object, Object, user_1.UserService, aurelia_event_aggregator_1.EventAggregator, aurelia_router_1.Router])
        ], Home);
        return Home;
    }());
    exports.Home = Home;
});

define('main',["require", "exports", './environment'], function (require, exports, environment_1) {
    "use strict";
    Promise.config({
        warnings: {
            wForgottenReturn: false
        }
    });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature('resources');
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        if (environment_1.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});

define('submission',["require", "exports"], function (require, exports) {
    "use strict";
    var categories = [
        'website',
        'mobile',
        'plugin',
        'theme'
    ];
    var Submission = (function () {
        function Submission() {
            this.formValid = true;
            this.fields = {
                name: {
                    label: 'Submission Name:',
                    required: true,
                    isValid: true,
                    errorMessage: 'A project name is required',
                    value: ''
                },
                category: {
                    label: 'Category',
                    required: true,
                    isValid: true,
                    errorMessage: 'A category is required',
                    value: ''
                },
                description: {
                    label: 'Description',
                    required: true,
                    isValid: true,
                    errorMessage: 'Please enter a brief description',
                    value: ''
                },
                url: {
                    label: 'Url',
                    required: true,
                    rules: 'repoUrl == empty',
                    isValid: true,
                    errorMessage: 'Please enter a URL or fill the repository URL if this has no URL.',
                    value: ''
                },
                repoUrl: {
                    label: 'Repo Url',
                    required: true,
                    rules: 'url == empty',
                    isValid: true,
                    errorMessage: 'A repository URL is required if the Url field is not filled out.',
                    value: ''
                }
            };
        }
        Submission.prototype.handleSubmit = function () {
            var formValid = true;
            for (var field in this.fields) {
                var actualField = this.fields[field];
                var validField = this.validateFieldWithReturnBoolean(actualField);
                if (!validField) {
                    actualField.isValid = false;
                }
                if (formValid && !validField) {
                    formValid = false;
                }
            }
            this.formValid = formValid;
        };
        Submission.prototype.validateField = function (field) {
            field.isValid = this.validateFieldWithReturnBoolean(field);
        };
        Submission.prototype.validateFieldWithReturnBoolean = function (field) {
            var fieldIsValid = true;
            if (field.required) {
                if (!field.rules) {
                    if (fieldIsEmpty(field.value)) {
                        fieldIsValid = false;
                    }
                    else {
                        fieldIsValid = true;
                    }
                }
                else {
                    var rules = field.rules.split(' ');
                    if (rules[2] === 'empty') {
                        if (fieldIsEmpty(field.value) && fieldIsEmpty(this.fields[rules[0]].value)) {
                            fieldIsValid = false;
                        }
                        else {
                            fieldIsValid = true;
                        }
                    }
                }
            }
            return fieldIsValid;
        };
        return Submission;
    }());
    exports.Submission = Submission;
    function validCategorySupplied(category) {
        return categories.indexOf(category) !== -1;
    }
    function fieldIsEmpty(field) {
        return field.trim() === '';
    }
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('partials/thumbnail',["require", "exports", 'aurelia-framework', '../services/user'], function (require, exports, aurelia_framework_1, user_1) {
    "use strict";
    var Thumbnail = (function () {
        function Thumbnail(userService) {
            this.userService = userService;
        }
        Thumbnail.prototype.handleClick = function (url, name) {
            if (window.clicky) {
                window.clicky.log(url, name);
            }
            return true;
        };
        Thumbnail.prototype.callVoteCallback = function (evt, name) {
            if (this.voteCallback) {
                this.voteCallback({
                    evt: evt,
                    name: name
                });
            }
        };
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', Object)
        ], Thumbnail.prototype, "project", void 0);
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', Object)
        ], Thumbnail.prototype, "voteCallback", void 0);
        Thumbnail = __decorate([
            aurelia_framework_1.autoinject,
            aurelia_framework_1.customElement('thumbnail'), 
            __metadata('design:paramtypes', [user_1.UserService])
        ], Thumbnail);
        return Thumbnail;
    }());
    exports.Thumbnail = Thumbnail;
});

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    function configure(config) {
        config.globalResources([
            './value-converters/async-binding-behavior',
            './value-converters/object-keys',
            './value-converters/prettify'
        ]);
    }
    exports.configure = configure;
});

define('resources/value-converters/async-binding-behavior',["require", "exports"], function (require, exports) {
    "use strict";
    var AsyncBindingBehavior = (function () {
        function AsyncBindingBehavior() {
        }
        AsyncBindingBehavior.prototype.bind = function (binding, source, busymessage) {
            binding.originalupdateTarget = binding.updateTarget;
            binding.updateTarget = function (a) {
                if (typeof a.then === 'function') {
                    if (busymessage)
                        binding.originalupdateTarget(busymessage);
                    a.then(function (d) { binding.originalupdateTarget(d); });
                }
                else
                    binding.originalupdateTarget(a);
            };
        };
        AsyncBindingBehavior.prototype.unbind = function (binding) {
            binding.updateTarget = binding.originalupdateTarget;
            binding.originalupdateTarget = null;
        };
        return AsyncBindingBehavior;
    }());
    exports.AsyncBindingBehavior = AsyncBindingBehavior;
});

define('resources/value-converters/object-keys',["require", "exports"], function (require, exports) {
    "use strict";
    var ObjectKeysValueConverter = (function () {
        function ObjectKeysValueConverter() {
        }
        ObjectKeysValueConverter.prototype.toView = function (obj) {
            var temp = [];
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    temp.push(obj[prop]);
                }
            }
            return temp;
        };
        return ObjectKeysValueConverter;
    }());
    exports.ObjectKeysValueConverter = ObjectKeysValueConverter;
});

define('resources/value-converters/prettify',["require", "exports"], function (require, exports) {
    "use strict";
    var PrettifyValueConverter = (function () {
        function PrettifyValueConverter() {
        }
        PrettifyValueConverter.prototype.toView = function (obj) {
            console.log(obj);
            var response = obj;
            try {
                response = JSON.stringify(obj);
            }
            catch (e) {
                response = obj;
            }
            return response;
        };
        return PrettifyValueConverter;
    }());
    exports.PrettifyValueConverter = PrettifyValueConverter;
});

define('text!about.html', ['module'], function(module) { module.exports = "<template>\r\n    <div class=\"row\">\r\n        <div class=\"col-xs-12 col-sm-8\">\r\n            <h1>About Built With Aurelia</h1>\r\n            <p>Built With Aurelia is a simplistic showcase of all the great things the Aurelia community are doing. Whether it be a website, mobile application or a plugin, Built With Aurelia shows you what is possible with Aurelia.</p>\r\n            <p>The idea stemmed from there being no official source of who or what has been built with Aurelia. This site itself is built on Aurelia, it is using the Aurelia CLI and RequireJS, there are no 3rd party dependencies and the entire site is hosted on Github.</p>\r\n        </div>\r\n    </div>\r\n</template>\r\n"; });
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"./app.css\"></require>\n    <require from=\"./partials/loader.html\"></require>\n    <require from=\"./partials/app-header.html\"></require>\n    <require from=\"./partials/app-footer.html\"></require>\n    <require from=\"./partials/modal.html\"></require>\n\n    <loader show.bind=\"router.isNavigating || appService.loading\"></loader>\n\n    <div class=\"hat ${showHat ? 'hat--active': ''}\">\n        <a href=\"javascript:void(0);\" click.delegate=\"closeHat()\" class=\"close\">X</a>\n        <div class=\"hat__inner\" if.bind=\"showHatLogin\">\n            <h1 class=\"hat__title\">Login</h1>\n            <p>To upvote submissions and other cool things, login here.<br>Not a member? <a href=\"javascript:void(0);\" click.delegate=\"register($event)\">click here</a> to signup.</p>\n            <p if.bind=\"formMessage\" class=\"error-message\" innerhtml.bind=\"formMessage\"></p>\n            <form submit.delegate=\"handleLogin($event)\">\n                <div class=\"form__row\">\n                    <input type=\"email\" name=\"email\" placeholder=\"Email\" value.bind=\"model.email\">\n                </div>\n                <div class=\"form__row\">\n                    <input type=\"password\" name=\"password\" value.bind=\"model.password\" autocomplete=\"off\">\n                </div>\n                <button type=\"submit\" class=\"button\" disabled.bind=\"!loginFormIsValid || disableButtons\">Login</button>\n            </form>\n        </div>\n        <div class=\"hat__inner\" if.bind=\"showHatRegister\">\n            <h1 class=\"hat__title\">Register</h1>\n            <p>Joining Built With Aurelia is quick and easy. Simply fill out the form below and you are on your way.<br>Already a member? <a href=\"javascript:void(0);\" click.delegate=\"login($event)\">click here to login</a></p>\n            <p if.bind=\"formMessage\" class=\"error-message\" innerhtml.bind=\"formMessage\"></p>\n            <form submit.delegate=\"handleRegister($event)\">\n                <div class=\"form__row\">\n                    <input type=\"email\" name=\"email\" placeholder=\"Email\" value.bind=\"model.email\">\n                </div>\n                <div class=\"form__row\">\n                    <input type=\"password\" name=\"password\" placeholder=\"Enter a strong password\" value.bind=\"model.password\" autocomplete=\"off\">\n                </div>\n                <div class=\"form__row\">\n                    <input type=\"password\" name=\"password2\" placeholder=\"Re-enter your chosen password\" value.bind=\"model.password2\" autocomplete=\"off\">\n                </div>\n                <p if.bind=\"!passwordsMatch\" class=\"error-message\">Please make sure both passwords match</p>\n                <button type=\"submit\" class=\"button\" disabled.two-way=\"!registerFormIsValid || disableButtons\">Register</button>\n            </form>\n        </div>\n        <div class=\"hat__inner\" if.bind=\"showHatSubmission\">\n            <h1 class=\"hat__title\">New Submission</h1>\n            <p>Make a new submission to the site. Just make sure you meet the criteria of it either being built using Aurelia or for Aurelia.</p>\n            <p if.bind=\"formMessage\" class=\"error-message\" innerhtml.bind=\"formMessage\"></p>\n            <form submit.delegate=\"handleSubmission($event)\">\n                <div class=\"form__row\">\n                    <p>\n                        <label>Project name <em>*</em></label>\n                        The name of this project.\n                    </p>\n                    <input type=\"text\" name=\"name\" placeholder=\"Project name\" value.bind=\"model.name\">\n                </div>\n                <div class=\"form__row\">\n                    <p>\n                        <label>Project category <em>*</em></label>\n                        What kind of project are you submitting?\n                    </p>\n                    <select name=\"category\" value.bind=\"model.category\">\n                        <option repeat.for=\"category of categories\" value.bind=\"category.value\" selected.bind=\"category.selected\">${category.name}</option>\n                    </select>\n                </div>\n                <div class=\"form__row\">\n                    <p>\n                        <label>Where can this submission be seen?</label>\n                        If you are not providing a repository link, this field is required.\n                    </p>\n                    <input type=\"text\" name=\"viewUrl\" placeholder=\"Demo/View URL\" value.bind=\"model.url\">\n                </div>\n                <div class=\"form__row\">\n                    <p>\n                        <label>Source code URL</label>\n                        If there is source code available, provide the link here to the Github/Bitbucket repository. Required if above URL field is empty.\n                    </p>\n                    <input type=\"text\" name=\"repoUrl\" placeholder=\"Github/Bitbucket/Source control URL\" value.bind=\"model.repoUrl\">\n                </div>\n                <div class=\"form__row\">\n                    <textarea name=\"description\" value.bind=\"model.description\"></textarea>\n                </div>\n                <div class=\"form__row\">\n                    <input type=\"text\" name=\"twitterHandle\" placeholder=\"@MyTwitterHandle\" value.bind=\"model.twitterHandle\">\n                </div>\n\n                <button type=\"submit\" class=\"button\" disabled.bind=\"!submissionFormIsValid || disableButtons\">Submit</button>\n            </form>\n        </div>\n    </div>\n\n    <app-header user.bind=\"userService\" login-callback.call=\"login($event)\" logout-callback.call=\"logout($event)\" submission-callback.call=\"submission($event)\"></app-header>\n\n    <main id=\"content\">\n        <div class=\"container\">\n            <router-view id=\"main-content\" class=\"main-content\"></router-view>\n        </div>\n    </main>\n    \n    <app-footer></app-footer>\n</template>\n"; });
define('text!app.css', ['module'], function(module) { module.exports = ".container-fluid,\n.container {\n  margin-right: auto;\n  margin-left: auto; }\n\n.container-fluid {\n  padding-right: 2rem;\n  padding-left: 2rem; }\n\n.row {\n  box-sizing: border-box;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-flex: 0;\n  -webkit-flex: 0 1 auto;\n  -ms-flex: 0 1 auto;\n  flex: 0 1 auto;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n  -webkit-flex-direction: row;\n  -ms-flex-direction: row;\n  flex-direction: row;\n  -webkit-flex-wrap: wrap;\n  -ms-flex-wrap: wrap;\n  flex-wrap: wrap;\n  margin-right: -0.5rem;\n  margin-left: -0.5rem; }\n\n.row.reverse {\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: reverse;\n  -webkit-flex-direction: row-reverse;\n  -ms-flex-direction: row-reverse;\n  flex-direction: row-reverse; }\n\n.col.reverse {\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: reverse;\n  -webkit-flex-direction: column-reverse;\n  -ms-flex-direction: column-reverse;\n  flex-direction: column-reverse; }\n\n.col-xs,\n.col-xs-1,\n.col-xs-2,\n.col-xs-3,\n.col-xs-4,\n.col-xs-5,\n.col-xs-6,\n.col-xs-7,\n.col-xs-8,\n.col-xs-9,\n.col-xs-10,\n.col-xs-11,\n.col-xs-12,\n.col-xs-offset-1,\n.col-xs-offset-2,\n.col-xs-offset-3,\n.col-xs-offset-4,\n.col-xs-offset-5,\n.col-xs-offset-6,\n.col-xs-offset-7,\n.col-xs-offset-8,\n.col-xs-offset-9,\n.col-xs-offset-10,\n.col-xs-offset-11,\n.col-xs-offset-12 {\n  box-sizing: border-box;\n  -webkit-box-flex: 0;\n  -webkit-flex: 0 0 auto;\n  -ms-flex: 0 0 auto;\n  flex: 0 0 auto;\n  padding-right: 0.5rem;\n  padding-left: 0.5rem; }\n\n.col-xs {\n  -webkit-box-flex: 1;\n  -webkit-flex-grow: 1;\n  -ms-flex-positive: 1;\n  flex-grow: 1;\n  -webkit-flex-basis: 0;\n  -ms-flex-preferred-size: 0;\n  flex-basis: 0;\n  max-width: 100%; }\n\n.col-xs-1 {\n  -webkit-flex-basis: 8.333%;\n  -ms-flex-preferred-size: 8.333%;\n  flex-basis: 8.333%;\n  max-width: 8.333%; }\n\n.col-xs-2 {\n  -webkit-flex-basis: 16.667%;\n  -ms-flex-preferred-size: 16.667%;\n  flex-basis: 16.667%;\n  max-width: 16.667%; }\n\n.col-xs-3 {\n  -webkit-flex-basis: 25%;\n  -ms-flex-preferred-size: 25%;\n  flex-basis: 25%;\n  max-width: 25%; }\n\n.col-xs-4 {\n  -webkit-flex-basis: 33.333%;\n  -ms-flex-preferred-size: 33.333%;\n  flex-basis: 33.333%;\n  max-width: 33.333%; }\n\n.col-xs-5 {\n  -webkit-flex-basis: 41.667%;\n  -ms-flex-preferred-size: 41.667%;\n  flex-basis: 41.667%;\n  max-width: 41.667%; }\n\n.col-xs-6 {\n  -webkit-flex-basis: 50%;\n  -ms-flex-preferred-size: 50%;\n  flex-basis: 50%;\n  max-width: 50%; }\n\n.col-xs-7 {\n  -webkit-flex-basis: 58.333%;\n  -ms-flex-preferred-size: 58.333%;\n  flex-basis: 58.333%;\n  max-width: 58.333%; }\n\n.col-xs-8 {\n  -webkit-flex-basis: 66.667%;\n  -ms-flex-preferred-size: 66.667%;\n  flex-basis: 66.667%;\n  max-width: 66.667%; }\n\n.col-xs-9 {\n  -webkit-flex-basis: 75%;\n  -ms-flex-preferred-size: 75%;\n  flex-basis: 75%;\n  max-width: 75%; }\n\n.col-xs-10 {\n  -webkit-flex-basis: 83.333%;\n  -ms-flex-preferred-size: 83.333%;\n  flex-basis: 83.333%;\n  max-width: 83.333%; }\n\n.col-xs-11 {\n  -webkit-flex-basis: 91.667%;\n  -ms-flex-preferred-size: 91.667%;\n  flex-basis: 91.667%;\n  max-width: 91.667%; }\n\n.col-xs-12 {\n  -webkit-flex-basis: 100%;\n  -ms-flex-preferred-size: 100%;\n  flex-basis: 100%;\n  max-width: 100%; }\n\n.col-xs-offset-1 {\n  margin-left: 8.333%; }\n\n.col-xs-offset-2 {\n  margin-left: 16.667%; }\n\n.col-xs-offset-3 {\n  margin-left: 25%; }\n\n.col-xs-offset-4 {\n  margin-left: 33.333%; }\n\n.col-xs-offset-5 {\n  margin-left: 41.667%; }\n\n.col-xs-offset-6 {\n  margin-left: 50%; }\n\n.col-xs-offset-7 {\n  margin-left: 58.333%; }\n\n.col-xs-offset-8 {\n  margin-left: 66.667%; }\n\n.col-xs-offset-9 {\n  margin-left: 75%; }\n\n.col-xs-offset-10 {\n  margin-left: 83.333%; }\n\n.col-xs-offset-11 {\n  margin-left: 91.667%; }\n\n.start-xs {\n  -webkit-box-pack: start;\n  -webkit-justify-content: flex-start;\n  -ms-flex-pack: start;\n  justify-content: flex-start;\n  text-align: start; }\n\n.center-xs {\n  -webkit-box-pack: center;\n  -webkit-justify-content: center;\n  -ms-flex-pack: center;\n  justify-content: center;\n  text-align: center; }\n\n.end-xs {\n  -webkit-box-pack: end;\n  -webkit-justify-content: flex-end;\n  -ms-flex-pack: end;\n  justify-content: flex-end;\n  text-align: end; }\n\n.top-xs {\n  -webkit-box-align: start;\n  -webkit-align-items: flex-start;\n  -ms-flex-align: start;\n  align-items: flex-start; }\n\n.middle-xs {\n  -webkit-box-align: center;\n  -webkit-align-items: center;\n  -ms-flex-align: center;\n  align-items: center; }\n\n.bottom-xs {\n  -webkit-box-align: end;\n  -webkit-align-items: flex-end;\n  -ms-flex-align: end;\n  align-items: flex-end; }\n\n.around-xs {\n  -webkit-justify-content: space-around;\n  -ms-flex-pack: distribute;\n  justify-content: space-around; }\n\n.between-xs {\n  -webkit-box-pack: justify;\n  -webkit-justify-content: space-between;\n  -ms-flex-pack: justify;\n  justify-content: space-between; }\n\n.first-xs {\n  -webkit-box-ordinal-group: 0;\n  -webkit-order: -1;\n  -ms-flex-order: -1;\n  order: -1; }\n\n.last-xs {\n  -webkit-box-ordinal-group: 2;\n  -webkit-order: 1;\n  -ms-flex-order: 1;\n  order: 1; }\n\n@media only screen and (min-width: 48em) {\n  .container {\n    width: 49rem; }\n  .col-sm,\n  .col-sm-1,\n  .col-sm-2,\n  .col-sm-3,\n  .col-sm-4,\n  .col-sm-5,\n  .col-sm-6,\n  .col-sm-7,\n  .col-sm-8,\n  .col-sm-9,\n  .col-sm-10,\n  .col-sm-11,\n  .col-sm-12,\n  .col-sm-offset-1,\n  .col-sm-offset-2,\n  .col-sm-offset-3,\n  .col-sm-offset-4,\n  .col-sm-offset-5,\n  .col-sm-offset-6,\n  .col-sm-offset-7,\n  .col-sm-offset-8,\n  .col-sm-offset-9,\n  .col-sm-offset-10,\n  .col-sm-offset-11,\n  .col-sm-offset-12 {\n    box-sizing: border-box;\n    -webkit-box-flex: 0;\n    -webkit-flex: 0 0 auto;\n    -ms-flex: 0 0 auto;\n    flex: 0 0 auto;\n    padding-right: 0.5rem;\n    padding-left: 0.5rem; }\n  .col-sm {\n    -webkit-box-flex: 1;\n    -webkit-flex-grow: 1;\n    -ms-flex-positive: 1;\n    flex-grow: 1;\n    -webkit-flex-basis: 0;\n    -ms-flex-preferred-size: 0;\n    flex-basis: 0;\n    max-width: 100%; }\n  .col-sm-1 {\n    -webkit-flex-basis: 8.333%;\n    -ms-flex-preferred-size: 8.333%;\n    flex-basis: 8.333%;\n    max-width: 8.333%; }\n  .col-sm-2 {\n    -webkit-flex-basis: 16.667%;\n    -ms-flex-preferred-size: 16.667%;\n    flex-basis: 16.667%;\n    max-width: 16.667%; }\n  .col-sm-3 {\n    -webkit-flex-basis: 25%;\n    -ms-flex-preferred-size: 25%;\n    flex-basis: 25%;\n    max-width: 25%; }\n  .col-sm-4 {\n    -webkit-flex-basis: 33.333%;\n    -ms-flex-preferred-size: 33.333%;\n    flex-basis: 33.333%;\n    max-width: 33.333%; }\n  .col-sm-5 {\n    -webkit-flex-basis: 41.667%;\n    -ms-flex-preferred-size: 41.667%;\n    flex-basis: 41.667%;\n    max-width: 41.667%; }\n  .col-sm-6 {\n    -webkit-flex-basis: 50%;\n    -ms-flex-preferred-size: 50%;\n    flex-basis: 50%;\n    max-width: 50%; }\n  .col-sm-7 {\n    -webkit-flex-basis: 58.333%;\n    -ms-flex-preferred-size: 58.333%;\n    flex-basis: 58.333%;\n    max-width: 58.333%; }\n  .col-sm-8 {\n    -webkit-flex-basis: 66.667%;\n    -ms-flex-preferred-size: 66.667%;\n    flex-basis: 66.667%;\n    max-width: 66.667%; }\n  .col-sm-9 {\n    -webkit-flex-basis: 75%;\n    -ms-flex-preferred-size: 75%;\n    flex-basis: 75%;\n    max-width: 75%; }\n  .col-sm-10 {\n    -webkit-flex-basis: 83.333%;\n    -ms-flex-preferred-size: 83.333%;\n    flex-basis: 83.333%;\n    max-width: 83.333%; }\n  .col-sm-11 {\n    -webkit-flex-basis: 91.667%;\n    -ms-flex-preferred-size: 91.667%;\n    flex-basis: 91.667%;\n    max-width: 91.667%; }\n  .col-sm-12 {\n    -webkit-flex-basis: 100%;\n    -ms-flex-preferred-size: 100%;\n    flex-basis: 100%;\n    max-width: 100%; }\n  .col-sm-offset-1 {\n    margin-left: 8.333%; }\n  .col-sm-offset-2 {\n    margin-left: 16.667%; }\n  .col-sm-offset-3 {\n    margin-left: 25%; }\n  .col-sm-offset-4 {\n    margin-left: 33.333%; }\n  .col-sm-offset-5 {\n    margin-left: 41.667%; }\n  .col-sm-offset-6 {\n    margin-left: 50%; }\n  .col-sm-offset-7 {\n    margin-left: 58.333%; }\n  .col-sm-offset-8 {\n    margin-left: 66.667%; }\n  .col-sm-offset-9 {\n    margin-left: 75%; }\n  .col-sm-offset-10 {\n    margin-left: 83.333%; }\n  .col-sm-offset-11 {\n    margin-left: 91.667%; }\n  .start-sm {\n    -webkit-box-pack: start;\n    -webkit-justify-content: flex-start;\n    -ms-flex-pack: start;\n    justify-content: flex-start;\n    text-align: start; }\n  .center-sm {\n    -webkit-box-pack: center;\n    -webkit-justify-content: center;\n    -ms-flex-pack: center;\n    justify-content: center;\n    text-align: center; }\n  .end-sm {\n    -webkit-box-pack: end;\n    -webkit-justify-content: flex-end;\n    -ms-flex-pack: end;\n    justify-content: flex-end;\n    text-align: end; }\n  .top-sm {\n    -webkit-box-align: start;\n    -webkit-align-items: flex-start;\n    -ms-flex-align: start;\n    align-items: flex-start; }\n  .middle-sm {\n    -webkit-box-align: center;\n    -webkit-align-items: center;\n    -ms-flex-align: center;\n    align-items: center; }\n  .bottom-sm {\n    -webkit-box-align: end;\n    -webkit-align-items: flex-end;\n    -ms-flex-align: end;\n    align-items: flex-end; }\n  .around-sm {\n    -webkit-justify-content: space-around;\n    -ms-flex-pack: distribute;\n    justify-content: space-around; }\n  .between-sm {\n    -webkit-box-pack: justify;\n    -webkit-justify-content: space-between;\n    -ms-flex-pack: justify;\n    justify-content: space-between; }\n  .first-sm {\n    -webkit-box-ordinal-group: 0;\n    -webkit-order: -1;\n    -ms-flex-order: -1;\n    order: -1; }\n  .last-sm {\n    -webkit-box-ordinal-group: 2;\n    -webkit-order: 1;\n    -ms-flex-order: 1;\n    order: 1; } }\n\n@media only screen and (min-width: 64em) {\n  .container {\n    width: 65rem; }\n  .col-md,\n  .col-md-1,\n  .col-md-2,\n  .col-md-3,\n  .col-md-4,\n  .col-md-5,\n  .col-md-6,\n  .col-md-7,\n  .col-md-8,\n  .col-md-9,\n  .col-md-10,\n  .col-md-11,\n  .col-md-12,\n  .col-md-offset-1,\n  .col-md-offset-2,\n  .col-md-offset-3,\n  .col-md-offset-4,\n  .col-md-offset-5,\n  .col-md-offset-6,\n  .col-md-offset-7,\n  .col-md-offset-8,\n  .col-md-offset-9,\n  .col-md-offset-10,\n  .col-md-offset-11,\n  .col-md-offset-12 {\n    box-sizing: border-box;\n    -webkit-box-flex: 0;\n    -webkit-flex: 0 0 auto;\n    -ms-flex: 0 0 auto;\n    flex: 0 0 auto;\n    padding-right: 0.5rem;\n    padding-left: 0.5rem; }\n  .col-md {\n    -webkit-box-flex: 1;\n    -webkit-flex-grow: 1;\n    -ms-flex-positive: 1;\n    flex-grow: 1;\n    -webkit-flex-basis: 0;\n    -ms-flex-preferred-size: 0;\n    flex-basis: 0;\n    max-width: 100%; }\n  .col-md-1 {\n    -webkit-flex-basis: 8.333%;\n    -ms-flex-preferred-size: 8.333%;\n    flex-basis: 8.333%;\n    max-width: 8.333%; }\n  .col-md-2 {\n    -webkit-flex-basis: 16.667%;\n    -ms-flex-preferred-size: 16.667%;\n    flex-basis: 16.667%;\n    max-width: 16.667%; }\n  .col-md-3 {\n    -webkit-flex-basis: 25%;\n    -ms-flex-preferred-size: 25%;\n    flex-basis: 25%;\n    max-width: 25%; }\n  .col-md-4 {\n    -webkit-flex-basis: 33.333%;\n    -ms-flex-preferred-size: 33.333%;\n    flex-basis: 33.333%;\n    max-width: 33.333%; }\n  .col-md-5 {\n    -webkit-flex-basis: 41.667%;\n    -ms-flex-preferred-size: 41.667%;\n    flex-basis: 41.667%;\n    max-width: 41.667%; }\n  .col-md-6 {\n    -webkit-flex-basis: 50%;\n    -ms-flex-preferred-size: 50%;\n    flex-basis: 50%;\n    max-width: 50%; }\n  .col-md-7 {\n    -webkit-flex-basis: 58.333%;\n    -ms-flex-preferred-size: 58.333%;\n    flex-basis: 58.333%;\n    max-width: 58.333%; }\n  .col-md-8 {\n    -webkit-flex-basis: 66.667%;\n    -ms-flex-preferred-size: 66.667%;\n    flex-basis: 66.667%;\n    max-width: 66.667%; }\n  .col-md-9 {\n    -webkit-flex-basis: 75%;\n    -ms-flex-preferred-size: 75%;\n    flex-basis: 75%;\n    max-width: 75%; }\n  .col-md-10 {\n    -webkit-flex-basis: 83.333%;\n    -ms-flex-preferred-size: 83.333%;\n    flex-basis: 83.333%;\n    max-width: 83.333%; }\n  .col-md-11 {\n    -webkit-flex-basis: 91.667%;\n    -ms-flex-preferred-size: 91.667%;\n    flex-basis: 91.667%;\n    max-width: 91.667%; }\n  .col-md-12 {\n    -webkit-flex-basis: 100%;\n    -ms-flex-preferred-size: 100%;\n    flex-basis: 100%;\n    max-width: 100%; }\n  .col-md-offset-1 {\n    margin-left: 8.333%; }\n  .col-md-offset-2 {\n    margin-left: 16.667%; }\n  .col-md-offset-3 {\n    margin-left: 25%; }\n  .col-md-offset-4 {\n    margin-left: 33.333%; }\n  .col-md-offset-5 {\n    margin-left: 41.667%; }\n  .col-md-offset-6 {\n    margin-left: 50%; }\n  .col-md-offset-7 {\n    margin-left: 58.333%; }\n  .col-md-offset-8 {\n    margin-left: 66.667%; }\n  .col-md-offset-9 {\n    margin-left: 75%; }\n  .col-md-offset-10 {\n    margin-left: 83.333%; }\n  .col-md-offset-11 {\n    margin-left: 91.667%; }\n  .start-md {\n    -webkit-box-pack: start;\n    -webkit-justify-content: flex-start;\n    -ms-flex-pack: start;\n    justify-content: flex-start;\n    text-align: start; }\n  .center-md {\n    -webkit-box-pack: center;\n    -webkit-justify-content: center;\n    -ms-flex-pack: center;\n    justify-content: center;\n    text-align: center; }\n  .end-md {\n    -webkit-box-pack: end;\n    -webkit-justify-content: flex-end;\n    -ms-flex-pack: end;\n    justify-content: flex-end;\n    text-align: end; }\n  .top-md {\n    -webkit-box-align: start;\n    -webkit-align-items: flex-start;\n    -ms-flex-align: start;\n    align-items: flex-start; }\n  .middle-md {\n    -webkit-box-align: center;\n    -webkit-align-items: center;\n    -ms-flex-align: center;\n    align-items: center; }\n  .bottom-md {\n    -webkit-box-align: end;\n    -webkit-align-items: flex-end;\n    -ms-flex-align: end;\n    align-items: flex-end; }\n  .around-md {\n    -webkit-justify-content: space-around;\n    -ms-flex-pack: distribute;\n    justify-content: space-around; }\n  .between-md {\n    -webkit-box-pack: justify;\n    -webkit-justify-content: space-between;\n    -ms-flex-pack: justify;\n    justify-content: space-between; }\n  .first-md {\n    -webkit-box-ordinal-group: 0;\n    -webkit-order: -1;\n    -ms-flex-order: -1;\n    order: -1; }\n  .last-md {\n    -webkit-box-ordinal-group: 2;\n    -webkit-order: 1;\n    -ms-flex-order: 1;\n    order: 1; } }\n\n@media only screen and (min-width: 75em) {\n  .container {\n    width: 76rem; }\n  .col-lg,\n  .col-lg-1,\n  .col-lg-2,\n  .col-lg-3,\n  .col-lg-4,\n  .col-lg-5,\n  .col-lg-6,\n  .col-lg-7,\n  .col-lg-8,\n  .col-lg-9,\n  .col-lg-10,\n  .col-lg-11,\n  .col-lg-12,\n  .col-lg-offset-1,\n  .col-lg-offset-2,\n  .col-lg-offset-3,\n  .col-lg-offset-4,\n  .col-lg-offset-5,\n  .col-lg-offset-6,\n  .col-lg-offset-7,\n  .col-lg-offset-8,\n  .col-lg-offset-9,\n  .col-lg-offset-10,\n  .col-lg-offset-11,\n  .col-lg-offset-12 {\n    box-sizing: border-box;\n    -webkit-box-flex: 0;\n    -webkit-flex: 0 0 auto;\n    -ms-flex: 0 0 auto;\n    flex: 0 0 auto;\n    padding-right: 0.5rem;\n    padding-left: 0.5rem; }\n  .col-lg {\n    -webkit-box-flex: 1;\n    -webkit-flex-grow: 1;\n    -ms-flex-positive: 1;\n    flex-grow: 1;\n    -webkit-flex-basis: 0;\n    -ms-flex-preferred-size: 0;\n    flex-basis: 0;\n    max-width: 100%; }\n  .col-lg-1 {\n    -webkit-flex-basis: 8.333%;\n    -ms-flex-preferred-size: 8.333%;\n    flex-basis: 8.333%;\n    max-width: 8.333%; }\n  .col-lg-2 {\n    -webkit-flex-basis: 16.667%;\n    -ms-flex-preferred-size: 16.667%;\n    flex-basis: 16.667%;\n    max-width: 16.667%; }\n  .col-lg-3 {\n    -webkit-flex-basis: 25%;\n    -ms-flex-preferred-size: 25%;\n    flex-basis: 25%;\n    max-width: 25%; }\n  .col-lg-4 {\n    -webkit-flex-basis: 33.333%;\n    -ms-flex-preferred-size: 33.333%;\n    flex-basis: 33.333%;\n    max-width: 33.333%; }\n  .col-lg-5 {\n    -webkit-flex-basis: 41.667%;\n    -ms-flex-preferred-size: 41.667%;\n    flex-basis: 41.667%;\n    max-width: 41.667%; }\n  .col-lg-6 {\n    -webkit-flex-basis: 50%;\n    -ms-flex-preferred-size: 50%;\n    flex-basis: 50%;\n    max-width: 50%; }\n  .col-lg-7 {\n    -webkit-flex-basis: 58.333%;\n    -ms-flex-preferred-size: 58.333%;\n    flex-basis: 58.333%;\n    max-width: 58.333%; }\n  .col-lg-8 {\n    -webkit-flex-basis: 66.667%;\n    -ms-flex-preferred-size: 66.667%;\n    flex-basis: 66.667%;\n    max-width: 66.667%; }\n  .col-lg-9 {\n    -webkit-flex-basis: 75%;\n    -ms-flex-preferred-size: 75%;\n    flex-basis: 75%;\n    max-width: 75%; }\n  .col-lg-10 {\n    -webkit-flex-basis: 83.333%;\n    -ms-flex-preferred-size: 83.333%;\n    flex-basis: 83.333%;\n    max-width: 83.333%; }\n  .col-lg-11 {\n    -webkit-flex-basis: 91.667%;\n    -ms-flex-preferred-size: 91.667%;\n    flex-basis: 91.667%;\n    max-width: 91.667%; }\n  .col-lg-12 {\n    -webkit-flex-basis: 100%;\n    -ms-flex-preferred-size: 100%;\n    flex-basis: 100%;\n    max-width: 100%; }\n  .col-lg-offset-1 {\n    margin-left: 8.333%; }\n  .col-lg-offset-2 {\n    margin-left: 16.667%; }\n  .col-lg-offset-3 {\n    margin-left: 25%; }\n  .col-lg-offset-4 {\n    margin-left: 33.333%; }\n  .col-lg-offset-5 {\n    margin-left: 41.667%; }\n  .col-lg-offset-6 {\n    margin-left: 50%; }\n  .col-lg-offset-7 {\n    margin-left: 58.333%; }\n  .col-lg-offset-8 {\n    margin-left: 66.667%; }\n  .col-lg-offset-9 {\n    margin-left: 75%; }\n  .col-lg-offset-10 {\n    margin-left: 83.333%; }\n  .col-lg-offset-11 {\n    margin-left: 91.667%; }\n  .start-lg {\n    -webkit-box-pack: start;\n    -webkit-justify-content: flex-start;\n    -ms-flex-pack: start;\n    justify-content: flex-start;\n    text-align: start; }\n  .center-lg {\n    -webkit-box-pack: center;\n    -webkit-justify-content: center;\n    -ms-flex-pack: center;\n    justify-content: center;\n    text-align: center; }\n  .end-lg {\n    -webkit-box-pack: end;\n    -webkit-justify-content: flex-end;\n    -ms-flex-pack: end;\n    justify-content: flex-end;\n    text-align: end; }\n  .top-lg {\n    -webkit-box-align: start;\n    -webkit-align-items: flex-start;\n    -ms-flex-align: start;\n    align-items: flex-start; }\n  .middle-lg {\n    -webkit-box-align: center;\n    -webkit-align-items: center;\n    -ms-flex-align: center;\n    align-items: center; }\n  .bottom-lg {\n    -webkit-box-align: end;\n    -webkit-align-items: flex-end;\n    -ms-flex-align: end;\n    align-items: flex-end; }\n  .around-lg {\n    -webkit-justify-content: space-around;\n    -ms-flex-pack: distribute;\n    justify-content: space-around; }\n  .between-lg {\n    -webkit-box-pack: justify;\n    -webkit-justify-content: space-between;\n    -ms-flex-pack: justify;\n    justify-content: space-between; }\n  .first-lg {\n    -webkit-box-ordinal-group: 0;\n    -webkit-order: -1;\n    -ms-flex-order: -1;\n    order: -1; }\n  .last-lg {\n    -webkit-box-ordinal-group: 2;\n    -webkit-order: 1;\n    -ms-flex-order: 1;\n    order: 1; } }\n\n.blocks {\n  align-items: flex-start; }\n\n@media all and (min-width: 768px) {\n  .blocks__block {\n    margin-bottom: 15px; } }\n\n.thumbnail {\n  height: 320px; }\n  @media all and (min-width: 768px) {\n    .thumbnail {\n      border-left: 12px solid #FFF; } }\n  .thumbnail:hover > .thumbnail__pullover {\n    height: 100%; }\n  .thumbnail > a {\n    display: block;\n    height: 100%;\n    left: 0;\n    position: absolute;\n    top: 0;\n    width: 100%;\n    z-index: 100; }\n\n.thumbnail__pullover {\n  background: rgba(0, 0, 0, 0.8);\n  bottom: 0;\n  color: #FFF;\n  height: 0;\n  left: 0;\n  overflow: hidden;\n  position: absolute;\n  text-align: left;\n  transition: all 0.4s ease;\n  width: 100%;\n  z-index: 1000; }\n  .thumbnail__pullover .thumbnail__inner {\n    max-width: 80%;\n    text-align: left; }\n    .thumbnail__pullover .thumbnail__inner a:not(.button) {\n      text-decoration: underline; }\n\n@media all and (min-width: 768px) {\n  .blocks__block--large .thumbnail__pullover p {\n    font-size: 20px;\n    line-height: 26px; } }\n\n.thumbnail--large {\n  height: 320px; }\n  @media all and (min-width: 768px) {\n    .thumbnail--large {\n      height: 460px; }\n      .thumbnail--large .thumbnail__heading {\n        font-size: 46px; } }\n\n.thumbnail__inner {\n  color: #FFF;\n  left: 50%;\n  max-width: 50%;\n  position: absolute;\n  text-align: center;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  width: 100%; }\n  .thumbnail__inner p {\n    font-size: 14px;\n    line-height: 20px; }\n  .thumbnail__inner a {\n    color: #FFF; }\n\n.thumbnail__heading {\n  border-bottom: 2px solid rgba(255, 255, 255, 0.5);\n  font-size: 32px;\n  font-weight: bold;\n  margin: 0 0 12px 0;\n  padding-bottom: 8px; }\n\n.thumbnail__subheading {\n  font-size: 18px;\n  font-weight: 400;\n  margin: 0; }\n\n@media all and (min-width: 768px) {\n  #sidebar {\n    padding-top: 50px; } }\n\n.sidebar__section {\n  margin-bottom: 40px;\n  padding-left: 0.5rem;\n  padding-right: 0.5rem; }\n  @media all and (min-width: 768px) {\n    .sidebar__section {\n      padding-left: 0;\n      padding-right: 0; } }\n  .sidebar__section:last-child {\n    margin-bottom: 0; }\n\n.form-row {\n  margin-bottom: 15px; }\n\n.form-row__label {\n  display: block;\n  font-weight: bold;\n  margin-bottom: 8px; }\n\n.form-row input,\n.form-row textarea,\n.form-row select {\n  display: block;\n  padding: 10px;\n  width: 100%; }\n\n* {\n  background-repeat: no-repeat;\n  box-sizing: border-box;\n  position: relative; }\n\nimg {\n  height: auto;\n  max-width: 100%; }\n\na {\n  color: #00ccd2;\n  text-decoration: none; }\n\n.link--underlined {\n  text-decoration: underline; }\n\n.error-message {\n  color: red; }\n\nnav {\n  border-bottom: 1px solid #dadada;\n  margin-bottom: 22px;\n  margin-left: 6px;\n  padding-bottom: 20px;\n  padding-left: .5rem;\n  padding-right: .5rem;\n  text-align: center;\n  width: 100%; }\n  @media all and (min-width: 768px) {\n    nav {\n      margin-left: 0;\n      padding-left: 0;\n      padding-right: 0;\n      text-align: left; } }\n\nnav nav {\n  margin-bottom: 30px; }\n\nnav li, nav ul {\n  font-size: 0;\n  list-style: none;\n  margin: 0;\n  padding: 0; }\n\nnav li {\n  display: inline-block;\n  font-size: 18px;\n  margin-right: 12px; }\n  nav li:last-child {\n    margin-right: 0; }\n  nav li a {\n    color: #aaa;\n    display: block;\n    text-decoration: none; }\n    nav li a.active, nav li a:hover {\n      color: #000; }\n\n.text--bold {\n  font-weight: 700; }\n\n.text--right {\n  text-align: right; }\n\n.hat {\n  background-color: #333;\n  border-bottom: 2px solid #fff;\n  color: #fff;\n  height: 0;\n  overflow: hidden;\n  transition: all .5s ease; }\n\n.hat__title {\n  font-size: 42px;\n  margin-bottom: 12px; }\n\n.hat__inner {\n  margin: 0 auto;\n  padding: 0 30px; }\n  .hat__inner form {\n    border-top: 1px solid #aaa;\n    margin-top: 15px;\n    padding-top: 30px; }\n  @media all and (min-width: 768px) {\n    .hat__inner {\n      width: 50%; } }\n\n.hat--active {\n  height: auto;\n  overflow-y: auto;\n  padding-bottom: 20px; }\n  @media all and (min-width: 768px) {\n    .hat--active {\n      height: calc(100vh - 2px); } }\n\n.close {\n  color: #fff;\n  font-size: 32px;\n  font-weight: 300;\n  position: absolute;\n  right: 10px;\n  text-decoration: none;\n  top: 10px;\n  z-index: 2; }\n\nbody {\n  background-color: #fff;\n  color: #000;\n  font-family: proxima-nova,Helvetica,Arial,sans-serif;\n  margin: 0;\n  padding: 0; }\n\np {\n  font-size: 20px;\n  line-height: 28px; }\n\n.list {\n  list-style-position: inside;\n  margin-left: 0;\n  padding-left: 0; }\n\n.list__item {\n  margin: 0 0 8px; }\n\n.list--no-style, .list__item--no-style {\n  list-style: none; }\n\n#main-header {\n  background: #333;\n  color: #fff;\n  height: 65px;\n  line-height: 65px;\n  margin-bottom: 50px;\n  text-align: center; }\n  @media all and (min-width: 768px) {\n    #main-header {\n      text-align: left; } }\n  #main-header .col-sm-6:last-child {\n    display: none; }\n    @media all and (min-width: 768px) {\n      #main-header .col-sm-6:last-child {\n        display: initial; } }\n  #main-header a {\n    color: inherit; }\n\n#logo {\n  font-size: 22px;\n  font-weight: 400;\n  margin: 0; }\n\n#main-content {\n  display: block; }\n  @media all and (min-width: 768px) {\n    #main-content {\n      padding-right: 30px; } }\n\npagination {\n  border-top: 1px solid #eaeaea;\n  display: flex;\n  margin-top: 20px;\n  padding-top: 20px; }\n\n.pagination__link {\n  margin-right: 10px; }\n\n#submission-iframe {\n  color: #000;\n  font-size: 22px;\n  height: 150vh;\n  width: 100%; }\n\n#main-footer {\n  border-top: 1px solid #eaeaea;\n  color: #333;\n  font-size: 12px;\n  margin-top: 60px;\n  padding-bottom: 20px;\n  padding-top: 20px; }\n\n.button {\n  background: none;\n  border: 1px solid #05babf;\n  color: #fff;\n  cursor: pointer;\n  display: inline-block;\n  font-size: 20px;\n  line-height: 1;\n  margin-right: 12px;\n  padding: 10px 20px;\n  transition: all .5s ease;\n  vertical-align: middle; }\n  .button:hover {\n    background-color: #05babf; }\n  .button:last-child {\n    margin-right: 0; }\n  .button:disabled {\n    cursor: not-allowed;\n    opacity: .3; }\n\n.button--dark {\n  color: #000; }\n  .button--dark:hover {\n    color: #fff; }\n\n.vote-buttons {\n  bottom: 0;\n  padding: 10px;\n  position: absolute;\n  right: 0;\n  z-index: 1; }\n  .vote-buttons a {\n    color: #e82887;\n    font-weight: 700;\n    transition: all 1s ease; }\n\n.vote--disabled {\n  cursor: not-allowed;\n  opacity: .3; }\n\n.fa-heart {\n  color: #e82887; }\n\n.form__row {\n  margin-bottom: 25px; }\n  .form__row p {\n    font-size: 12px;\n    line-height: 19px;\n    margin: 0 0 12px;\n    max-width: 350px; }\n    .form__row p label {\n      display: block;\n      font-size: 18px;\n      font-weight: 700;\n      line-height: 1;\n      margin-bottom: 5px; }\n      .form__row p label em {\n        color: red;\n        font-size: 11px;\n        font-style: inherit;\n        vertical-align: middle; }\n  .form__row input, .form__row select, .form__row textarea {\n    background: #fff;\n    border: none;\n    padding: 10px;\n    width: 100%; }\n    @media all and (min-width: 768px) {\n      .form__row input, .form__row select, .form__row textarea {\n        width: 375px; } }\n  .form__row textarea {\n    height: 150px; }\n\nmodal {\n  align-items: center;\n  background: rgba(0, 0, 0, 0.9);\n  display: flex;\n  justify-content: center;\n  height: 100vh;\n  left: 0;\n  position: fixed;\n  top: 0;\n  width: 100vw;\n  z-index: 3; }\n\n.modal__inner {\n  background: #fff;\n  padding: 20px;\n  width: 500px; }\n  .modal__inner h1, .modal__inner h2, .modal__inner h3, .modal__inner h4, .modal__inner h5, .modal__inner h6 {\n    font-weight: 400;\n    margin: 0 0 15px; }\n\n.bg--purple {\n  background-color: #646fc7; }\n\n.bg--grapefruit {\n  background-color: #e14840; }\n\n.bg--medium-blue {\n  background-color: #4e73aa; }\n\n.bg--bright-blue {\n  background-color: #00c3ff; }\n\n.bg--gentle-pink {\n  background-color: #ffc3cd; }\n\n.bg--teal {\n  background-color: #21ada4; }\n\n.bg--middle-blue {\n  background-color: #00a5c6; }\n\n.bg--light-cyan {\n  background-color: #1cd8e7; }\n\n.bg--brave-orange {\n  background-color: #ff794e; }\n\n.bg--yellow-its-me {\n  background-color: #fddc57; }\n\n.bg--green {\n  background-color: #6f9661; }\n\n.bg--pie {\n  background-color: #fdbe79; }\n\n.bg--dark {\n  background-color: #424242; }\n\n.bg--aurelia-pink {\n  background-color: #bc157a;\n  color: #fff; }\n"; });
define('text!home.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"resources/value-converters/object-keys\"></require>\n    <require from=\"partials/pagination.html\"></require>\n    <require from=\"partials/thumbnail\"></require>\n    \n    <nav>\n        <ul>\n            <li repeat.for=\"category of categories | objectKeys\"><a href=\"javascript:void(0);\" class=\"${category == currentCategory ? 'active': ''}\" click.delegate=\"filterCategory(category)\">${category.name} <span>(${category.count})</span></a></li>\n        </ul>\n    </nav>\n\n    <nav>\n        <ul>\n            <li><a href=\"javascript:void(0);\" class=\"${currentSortMode == 'popular' ? 'active' : ''}\" click.delegate=\"sortBy('popular')\">Popular</a></li>\n            <li><a href=\"javascript:void(0);\" class=\"${currentSortMode == 'new' ? 'active' : ''}\" click.delegate=\"sortBy('new')\">Newly Added</a></li>\n        </ul>\n    </nav>\n\n    <div class=\"blocks row\">\n        <div id=\"no-results\" if.bind=\"!projects.length && !appService.loading\"><h2>Sorry, nothing was found :(</h2></div>\n        <template repeat.for=\"project of projects\">\n            <template if.bind=\"$index == 1\">\n                <div class=\"col-xs-12 col-sm-6 thumbnail blocks__block bg--dark\">\n                    <div class=\"thumbnail__inner\">\n                        <h1 class=\"thumbnail__heading\">Built With Aurelia</h1>\n                        <h2 class=\"thumbnail__subheading\">A showcase of applications, plugins and resources developed for or using the Aurelia Javascript framework.<br><br><a href=\"javascript:void(0);\" click.delegate=\"submission()\" class=\"link--underlined\">Make a Submission</a></h2>\n                    </div>\n                </div>\n            </template>\n            <template if.bind=\"$index == 3\">\n                <div class=\"col-xs-12 col-sm-6 thumbnail blocks__block bg--dark\">\n                    <div class=\"thumbnail__inner\">\n                        <h1 class=\"thumbnail__heading\">Links</h1>\n                        <ul class=\"list\">\n                            <li class=\"list__item list__item--no-style\"><a href=\"http://aurelia.io\" target=\"_blank\">Aurelia Website</a></li>\n                            <li class=\"list__item list__item--no-style\"><a href=\"http://aurelia.io/hub.html\" target=\"_blank\">Aurelia Developer Hub</a></li>\n                            <li class=\"list__item list__item--no-style\"><a href=\"https://github.com/aurelia\" target=\"_blank\">Aurelia Github</a></li>\n                            <li class=\"list__item list__item--no-style\"><a href=\"https://twitter.com/AureliaEffect\" target=\"_blank\">Aurelia Twitter</a></li>\n                        </ul>\n                    </div>\n                </div>\n            </template>\n            <thumbnail class=\"blocks__block ${!$first ? getRandomBackgroundColour(project.name) : 'bg--aurelia-pink blocks__block--large'} ${$first ? 'col-xs-12 col-sm-12 thumbnail--large' : 'col-xs-12 col-sm-6'}\" project.bind=\"project\" vote-callback.call=\"vote(evt, name)\"></thumbnail>\n        </template>\n    </div>\n</template>\n"; });
define('text!submission.html', ['module'], function(module) { module.exports = "<template>\n    <h1>Contribute to Built With Aurelia</h1>\n    <p>Whether it be a plugin or a cool site that you built, tell the world about it.</p>\n    \n    <iframe src=\"https://docs.google.com/forms/d/e/1FAIpQLScKJzv82LP6Yb3DCJrg6vHiyTZwitzxv9R3m-V2d6wFY5S-bQ/viewform?embedded=true\" id=\"submission-iframe\" width=\"760\" height=\"500\" frameborder=\"0\" marginheight=\"0\" marginwidth=\"0\">Loading...</iframe>\n</template>\n"; });
define('text!partials/app-footer.html', ['module'], function(module) { module.exports = "<template containerless>\r\n    <footer id=\"main-footer\">\r\n        <div class=\"container\">\r\n            <div class=\"row\">\r\n                <div class=\"col-sm-6\">Built by <a href=\"http://ilikekillnerds.com\" target=\"_blank\">Dwayne Charrington</a> &copy; 2016</div>\r\n                <div class=\"col-sm-6 text--right\"><small>Running on Aurelia <3 </small></div>\r\n            </div>\r\n        </div>\r\n    </footer>\r\n</template>\r\n"; });
define('text!partials/app-header.html', ['module'], function(module) { module.exports = "<template bindable=\"user, submissionCallback, loginCallback, logoutCallback\" containerless>\n\n    <header id=\"main-header\">\n        <div class=\"container\">\n            <div class=\"row\">\n                <h1 id=\"logo\" class=\"col-xs-12 col-sm-6\"><a route-href=\"route:home\">Built With Aurelia</a></h1>\n                <div class=\"col-sm-6 text--right\">\n                    <a href=\"javascript:void(0);\" class=\"text--bold\" click.delegate=\"submissionCallback()\">Make a Submission</a>\n                    <span>&nbsp;|&nbsp;</span>\n                    <a href=\"javascript:void(0);\" if.bind=\"!user.isLoggedIn\" click.delegate=\"loginCallback()\">Login/Register</a>\n                    <a href=\"javascript:void(0);\" if.bind=\"user.isLoggedIn\" click.delegate=\"logoutCallback()\">Logout</a>\n                    <span>&nbsp;|&nbsp;</span>\n                    <a route-href=\"route: about\">About</a>\n                    <span>&nbsp;|&nbsp;</span>\n                    <a href=\"mailto:dwaynecharrington@gmail.com\">Contact</a>\n                </div>\n            </div>\n        </div>\n    </header>\n\n</template>\n"; });
define('text!partials/loader.html', ['module'], function(module) { module.exports = "<template bindable=\"loading\" class=\"loader\">\r\n    <div class=\"loader__inner\">\r\n        <span class=\"loader__indicator\"></span>\r\n        <h2 class=\"ellipsis\">Loading</h2>\r\n    </div>\r\n</template>\r\n"; });
define('text!partials/modal.html', ['module'], function(module) { module.exports = "<template class=\"modal\" bindable=\"type, title, yesCallback, cancelCallback\">\n    <div class=\"modal__inner\">\n        <header class=\"modal__header\"><h1>${title}</h1></header>\n\n        <slot></slot>\n\n        <div class=\"modal__footer\">\n            <a href=\"javascript:void(0);\" click.delegate=\"yesCallback()\" class=\"button button--dark\">Okay</a>\n        </div>\n\n        <template if.bind=\"type === 'confirm'\">\n            <div class=\"modal__footer\">\n                <a href=\"javascript:void(0);\" click.delegate=\"yesCallback()\" class=\"button\">Okay</a>\n                <a href=\"javascript:void(0);\" click.delegate=\"cancelCallback()\" class=\"button\">Cancel</a>\n            </div>\n        </template>\n    </div>\n</template>\n"; });
define('text!partials/pagination.html', ['module'], function(module) { module.exports = "<template bindable=\"totalPages\">\n    <a class=\"pagination__link\" route-href=\"route: home; params.bind: {page: i + 1}\" repeat.for=\"i of totalPages\">${i + 1}</a>\n</template>\n"; });
define('text!partials/project.html', ['module'], function(module) { module.exports = "<template bindable=\"project\">\r\n    <div class=\"project project--single\" with.bind=\"project\">\r\n        <div class=\"row\">\r\n            <div class=\"col-xs-12 col-sm-8\">\r\n                <header>\r\n                    <h1 class=\"project__name project__name--large\">${name}</h1>\r\n                    <div class=\"project__border ${colour}\" if.bind=\"colour\"></div>\r\n                </header>\r\n\r\n                <div class=\"project__content project__content--black\">\r\n                    <p innerhtml.bind=\"description\"></p>\r\n                </div>\r\n\r\n                <a href=\"${url}\" class=\"button\" target=\"_blank\">View</a>\r\n                <a if.bind=\"repoUrl\" href=\"${repoUrl}\" class=\"button\" target=\"_blank\">Source Code</a>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</template>\r\n\r\n"; });
define('text!partials/thumbnail.html', ['module'], function(module) { module.exports = "<template class=\"thumbnail\">\n    <template with.bind=\"project\">\n        <div class=\"thumbnail__inner\">\n            <h1 class=\"thumbnail__heading\">${name}</h1>\n            <h2 class=\"thumbnail__subheading\">${category}</h2>\n        </div>\n        <div class=\"thumbnail__pullover\">\n            <div class=\"thumbnail__inner\">\n                <p innerhtml.bind=\"description\"></p>\n                <a href=\"${url}\" class=\"button\" target=\"_blank\" click.delegate=\"handleClick(url, name)\">View</a>\n                <a if.bind=\"repoUrl\" href=\"${repoUrl}\" class=\"button\" target=\"_blank\" click.delegate=\"handleClick(repoUrl, name)\">Source Code</a>\n            </div>\n\n            <div class=\"vote-buttons\">\n                <a href=\"javascript:void(0);\" class=\"vote ${!userService.isLoggedIn ? 'vote--disabled' : ''} fa ${currentUserHasVotedFor ? 'fa-heart': 'fa-heart-o'}\" aria-hidden=\"true\" click.delegate=\"callVoteCallback($event, name)\"></a>\n                <span>${votes}</span>\n            </div>\n        </div>\n    </template>\n</template>\n\n"; });
define('text!feed.html', ['module'], function(module) { module.exports = "<template>\n    <?xml version=\"1.0\" encoding=\"utf-8\"?>\n    <rss version=\"2.0\">\n        <channel>\n            <title>Built With Aurelia</title>\n            <link>http://builtwithaurelia.com/</link>\n            <description>Latest submissions added to Built With Aurelia.</description>\n            <template repeat.for=\"item of items\">${item}</template>\n        </channel>\n    </rss>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map