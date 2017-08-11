(function () {
    "use strict";
    angular.module('llApp').controller('addGames', ['PariPlay', '$scope', '$state', '$rootScope', function (PariPlay, $scope, $state, $rootScope) {

        $rootScope.getIp();

        PariPlay.getGames().then(function (data) {
            $scope.games = data;
        });

        $scope.playAffGame = function (game) {
            PariPlay.loadGame(game).then(function (data) {
                if (data.success) {
                    $state.go('app.addGame');
                } else {
                    alert("error loading game data");
                }
            });
        };
    }]);
}());
