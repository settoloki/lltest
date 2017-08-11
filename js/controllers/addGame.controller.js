(function () {
    "use strict";
    angular.module('llApp').controller('addGame', ['PariPlay', '$scope', '$state', '$cordovaInAppBrowser', function (PariPlay, $scope, $state, $cordovaInAppBrowser) {
        $scope.game = PariPlay.current_game;
        screen.orientation.unlock();

        function onFusionError(e) {
            console.log("Something went wrong \n Reason: " + e.message);
        }

        function onFusionSuccess() {
            console.log("FUSION SUCCESS");

            fusion.addListener('roundEnd', _printData);
            fusion.addListener('gameLoad', _printData);
            fusion.addListener('frameReady', _printData);
            fusion.addListener('beforeRoundStart', _printData);
            fusion.addListener('roundStart', _printData);
            fusion.addListener('balanceUpdate', _printData);
            fusion.addListener('noRoundsLeft', _printData);
            fusion.addListener('revealAll', _printData);
            fusion.addListener('cashier', _printData);
            fusion.addListener('buyMoreTickets', _printData);
            fusion.addListener('quit', onFusionQuit);
        }

        function onFusionQuit(data) {
            _printData(data);
            screen.orientation.lock('portrait');
            $state.go('app.addGames');
        }

        function _printData(data) {
            var str = data.type + '\n';
            if (data) {
                for (var key in data) {
                    str += key + ': ' + data[key] + '\n';
                }
            }
            str += '-------------------------';
            console.log(str);
        }

        fusion.init({
            gameCode: $scope.game.code,
            onSuccess: onFusionSuccess,
            onError: onFusionError
        });


        var options = {
            location: 'no',
            clearcache: 'yes',
            toolbar: 'no'
        };

        document.addEventListener("deviceready", function () {
            $cordovaInAppBrowser.open($scope.game.url, '_system', options).then(function (event) {
                console.log(event);
            });
        });

    }]);
}());
