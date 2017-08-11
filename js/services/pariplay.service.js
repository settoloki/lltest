(function () {
    "use strict";
    angular.module('llApp').factory('PariPlay', ['$http', '$rootScope', function ($http, $rootScope) {
        var sToken = $rootScope.sToken;

        var PariPlay = {
            games: null,
            current_game: null,
            getGames: function () {

                var req = {
                    method: 'POST',
                    url: $rootScope.url + "/getPariplayGameList",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: $.param({
                        sToken: sToken
                    })
                };

                return $http(req).then(function (response) {
                    console.log("Response:", response);
                    PariPlay.games = response.data.response;

                    return response.data.response;
                });
            },
            loadGame: function (game) {
                var req = {
                    method: 'POST',
                    url: $rootScope.url + "/launchPariplayGame",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: $.param({
                        gameCode: game.code,
                        ip: $rootScope.ip
                    })
                };
                return $http(req).then(function (response) {
                    PariPlay.current_game = response.data.response;
                    PariPlay.current_game.code = game.code;
                    return response.data.response;
                });
            }
        };

        return PariPlay;
    }]);
})();
