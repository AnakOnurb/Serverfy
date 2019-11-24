(function () {
    'use strict';

    angular
        .module('app')
        .controller('Command.IndexController', Controller);

    function Controller($window, ServerService, FlashService) {
        var vm = this;
        
        vm.Version = null;
    
        getVersion();

        function getVersion() 
        {            
            CommandService.GetVersion().then(function (Version) {                
                vm.Version = Version;                          
            });            
        }
    }
})();