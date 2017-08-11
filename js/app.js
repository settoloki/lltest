var llApp = angular.module('llApp',
    [
        'ionic',
        'ngCordova',
        'ngMessages'
    ])
        .config(['$ionicConfigProvider', '$httpProvider',function ($ionicConfigProvider, $httpProvider) {


        }]);






angular.module('llApp').run([
    '$ionicPlatform',
    '$rootScope',
    '$http',
    function (
        $ionicPlatform,
        $rootScope,
        $http
    ) {

    $rootScope.primary_domain = 'http://uat4.livelotto.co.uk';
    $rootScope.version = "2.0"; //Version update 09/08/2017


    $rootScope.url = $rootScope.primary_domain + '/api';
$rootScope.getIp = function () {
            const ipurl = "http://freegeoip.net/json/";
            if (!$rootScope.ip) {
                $http.get(ipurl).then(function (response) {
            console.log(response.data.ip);
            $rootScope.ip = response.data.ip;
                    return $rootScope.ip;
          });
            }

            return $rootScope.ip;
        };

    }]);

angular.module('llApp').config(['$stateProvider', '$urlRouterProvider', '$compileProvider', '$ionicConfigProvider', function ($stateProvider, $urlRouterProvider, $compileProvider, $ionicConfigProvider) {
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|app|video|llApp):/);
    //$ionicConfigProvider.views.maxCache(0);
    $stateProvider

        .state('app', {
            cache: true,
            url: '/app',
            abstract: true,
            templateUrl: 'templates/menu.html'
        })
        .state('app.splash', {
            cache: false,
            url: '/splash',
            views: {
                'menuContent': {
                    templateUrl: 'templates/splash/splash.html',
                    controller: 'SplashController'
                }
            },
            data: {
                playMusic: false
            }
        })
        .state('app.addGames', {
            cache: false,
            url: '/affiliate-games',
            views: {
                'menuContent': {
                    templateUrl: 'templates/moreGames/dashboard.html',
                    controller: 'addGames'
                }
            },
            data: {
                playMusic: true
            }
        })
        .state('app.addGame', {
            cache: false,
            url: '/affiliategame',
            views: {
                'menuContent': {
                    templateUrl: "templates/moreGames/game.html",
                    controller: "addGame"
                }
            },
            data: {
                playMusic: false
            }
        })
         .state('app.login', {
            cache: false,
            url: '/login',
            views: {
                'menuContent': {
                    templateUrl: 'templates/login/login.html',
                    controller: 'LoginController'
                }
            },
            data: {
                playMusic: false
            }
        })
    ;
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/affiliate-games');
}]);
