/**
 * The login controller
 *
 * From here we can login with email + password, or login with Facebook
 * We also have a couple of buttons that take us elsewhere
 */
angular.module('llApp')
    .controller('LoginController', ['$scope', '$http', '$location', '$state', '$q', '$ionicLoading', '$rootScope', '$analytics', '$ionicPlatform', '$cordovaFacebook', function ($scope, $http, $location, $state, $q, $ionicLoading, $rootScope, $analytics, $ionicPlatform, $cordovaFacebook) {
        //when we have the login form submitted, we need to try and login
        document.addEventListener("deviceready", function () {
            screen.orientation.lock('portrait');
        });
        $rootScope.sound.playMusic = false;
        // if (window.cordova && $cordovaDevice.getPlatform() == 'iOS') {
        //     $cordovaKeyboard.hideAccessoryBar(false);
        //     $cordovaKeyboard.disableScroll(false);
        // }
        $scope.logout = function () {
            $http({
                method: 'GET',
                url: $scope.url + '/logout'
            }).then(function (response) {
                delete $rootScope.request_count;
                localStorage.removeItem('User');
                localStorage.removeItem('deposit_check');
                localStorage.removeItem('limits');
                //localStorage.removeItem('sToken');
                //localStorage.removeItem('help_shown');
                localStorage.removeItem('visited_lobbies');
                localStorage.setItem('deposit_check', false);
                localStorage.setItem('logout', true);
                $scope.$data = {};
                delete $scope.$data;
                $scope.sToken = '';
                delete $scope.sToken;
                $rootScope.sToken = '';
                delete $rootScope.sToken;
                delete $rootScope.request_count;
                // $scope.$data.step1 = {};
                // $scope.$data.step2 = {};
                // $scope.$data.step3 = {};
                // $scope.user = {};
                delete $scope.user;
                // $rootScope.user = {};
                delete $rootScope.user;
                //$rootScope.pauseThemeTune();
                //$scope.createjs.Sound.stop("sound");
                //before clearing out, make a reference to the remember detail stuff
                if (localStorage.getItem('remember_details')) {
                    var $remember = localStorage.getItem('remember_details');
                }
                //localStorage.clear();
                if (typeof $remember !== 'undefined') {
                    localStorage.setItem('remember_details', $remember);
                }
            }, function () {

            });

        };

            var pass = {};
            $scope.form = {};
            $rootScope.new_user = false;
            localStorage.removeItem('sToken');
            localStorage.removeItem('User');
            localStorage.removeItem('limits');
            // localStorage.removeItem('play_music');
            //localStorage.clear();
            delete $rootScope.sToken;
            $scope.user = {};
            $rootScope.user = {};
            delete $rootScope.user;
            delete $scope.user;

            if (localStorage.getItem('remember_details')) {
                $scope.reg_user = JSON.parse(localStorage.getItem('remember_details'));
            }


            var fbLoginSuccess = function (response) {

                if (!response.authResponse) {
                    fbLoginError("Cannot find the authResponse");
                    return;
                }

                var authResponse = response.authResponse;


                getFacebookProfileInfo(authResponse).then(
                    function (profileInfo) {
                        var $token = response.authResponse.accessToken;
                        //if we have stuff, lets try to login
                        $ionicLoading.show({
                            template: 'Loading'
                        });
                        $http({
                            method: 'POST',
                            url: $scope.url + '/login/',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            data: $.param({
                                access_token: $token
                            })
                        }).then(
                            function (response) {
                                $ionicLoading.hide();
                                //based on the response, do something
                                if (parseInt(response.data.error.code) !== 0) {
                                    //assume we have no user, go to the signup
                                    $state.go('app.register');
                                } else {
                                    if (response.data.response.newUser == true) {
                                        $rootScope.FbInfo = profileInfo;
                                        $rootScope.new_user = true;
                                        localStorage.setItem('User', JSON.stringify(response.data.response.User));
                                        //we will also have an sToken here
                                        localStorage.setItem('sToken', response.data.sToken);
                                        $state.go('app.register');
                                    }
                                    else {
                                        //success - store details of the user in the session, move to the dasboard
                                        localStorage.setItem('sToken', response.data.sToken);
                                        localStorage.setItem('User', JSON.stringify(response.data.response.User));
                                        $analytics.setUsername(response.data.response.User.username);
                                        localStorage.setItem('limits', JSON.stringify(response.data.spend_limits));
                                        // createjs.Sound.registerSound("audio/LiveHomeCasino.mp3", "sound");
                                        // createjs.Sound.play("sound");
                                        //we can move on now then
                                        //register device if iOS
                                        $rootScope.registerDevice();
                                        $state.go('app.dashboard');
                                    }
                                }
                            },
                            function () {
                                $ionicLoading.hide();
                                $scope.showAlert('Sorry, there was a problem logging in');
                            }
                        );
                    }
                )
            };

            // This is the fail callback from the login method
            var fbLoginError = function (error) {
                $ionicLoading.hide();
            };

            // This method is to get the user profile info from the facebook api
            var getFacebookProfileInfo = function (authResponse) {
                var info = $q.defer();


                $cordovaFacebook.api("me", ["public_profile"]).then(
                    function (response) {

                        info.resolve(response);
                    },
                    function (response) {

                        info.reject(response);
                    });

                return info.promise;
            };


            //Login form
            $scope.doLogin = function () {
                var $username = $scope.reg_user.username;
                var $password = $scope.reg_user.password;
                var $remember = $scope.reg_user.remember;

                if (!$username || $username.length <= 0) {
                    $scope.showAlert('No Username entered');
                    return;
                }

                if (!$password || $password.length <= 0) {
                    $scope.showAlert('No Password entered');
                    return;
                }

                //if we have stuff, lets try to login
                $ionicLoading.show({
                    template: 'Loading'
                });
                // $http({
                //  method: 'GET',
                //  url: $scope.url + '/login/' + $username + '/' + $password,
                // 	params: {
                //      motionlab: 'active' //REMOVE THIS BEFORE LAUNCH
                // 	}
                // })
                $http({
                    method: 'POST',
                    url: $scope.url + '/login/',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: $.param({username: $username, password: $password})
                }).then(function (response) {
                        $ionicLoading.hide();
                        //based on the response, do something
                        if (response.data.error.code != 0) {
                            //error
                            $ionicLoading.hide();
                            $scope.showAlert(response.data.error.message);

                        } else {
                            //success - store details of the user in the session, move to the dasboard
                            //delete stuff just in case
                            localStorage.removeItem('sToken');
                            localStorage.removeItem('User');
                            localStorage.removeItem('limits');


                            //before carrying on, if the user wants us to remember details, save them in a local storage box
                            if ($remember) {
                                var $remember_info = {username: $username, password: $password, remember: $remember};
                                localStorage.setItem('remember_details', JSON.stringify($remember_info));
                            } else {
                                //if it isnt set, delete any reference just in case
                                localStorage.removeItem('remember_details');
                            }
                            localStorage.setItem('sToken', response.data.sToken);
                            localStorage.setItem('User', JSON.stringify(response.data.response.User));
                            $analytics.setUsername(response.data.response.User.username);
                            localStorage.setItem('limits', JSON.stringify(response.data.spend_limits));
                            //localStorage.setItem('play_music',true);
                            // $rootScope.user = JSON.stringify(response.data.response.User);
                            $ionicLoading.hide();
                            //stop doesn't work here
                            //$scope.createjs.Sound.stop("sound");
                            //even commented out sound plays?
                            // $scope.createjs.Sound.play("sound",$rootScope.ppc);
                            //we can move on now then
                            // $scope.getFriends();
                            $rootScope.registerDevice();
                            $state.go('app.dashboard');
                        }
                    },
                    function () {
                        $ionicLoading.hide();
                        $scope.showAlert('Sorry, there was a problem logging in');
                    });
            };

            // Reset password
            $scope.resetpass = function ($email) {
                $rootScope.resetPass = true;
                if (!$email || $email.length <= 0) {
                    $scope.showAlert('No Email entered');
                    return;
                }

                $ionicLoading.show({
                    template: 'Loading'
                });

                $http({
                    method: 'POST',
                    url: $scope.url + '/passwordReset',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: $.param({
                        email: $email
                    })

                }).then(function (response) {
                    $ionicLoading.hide();
                    if (response.data.error.code != 0) {
                        alert(response.data.error.message);

                    }
                    else {
                        $scope.showAlert('Please check your inbox for your password reset');

                    }
                })
            };

            //facebook login
            $scope.facebook_login = function () {


                // if (!window.cordova) {
                //     facebookConnectPlugin.browserInit(1522422484712736);
                //     // version is optional. It refers to the version of API you may want to use.
                //     console.log("No window cordova");
                // }

                $cordovaFacebook.getLoginStatus()
                    .then(function (success) {

                        if (success.status === 'connected') {
                            fbLoginSuccess(success);
                        } else {
                            // $ionicLoading.show({
                            //     template: 'Logging in...'
                            // });

                            $cordovaFacebook.login(['email', 'public_profile']).then(function (success) {
                                fbLoginSuccess(success);
                            }, function (error) {
                                fbLoginError(error);
                            });
                        }
                    }, function (error) {

                    });
            };
    }]);
