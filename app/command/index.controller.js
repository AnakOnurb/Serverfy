(function () {
    'use strict';

    angular
        .module('app')
        .controller('Command.IndexController', Controller);

    function Controller($window, CommandService, FlashService) {
        var vm = this;

        vm.Version = null;

        getVersion();

        function getVersion()
        {
            CommandService.GetVersion().then(function (Version) {
                vm.Version = Version;
                document.getElementById("version").innerHTML = vm.Version;
            });
        }
    }
})();
