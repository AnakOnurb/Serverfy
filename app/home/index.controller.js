(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller(UserService, ServerService, CommandService) {
        var vm = this;

        vm.user = null;
        vm.ServerList = null;

        initUser();

        function initUser() {
            // get current user data in the API
            UserService.GetUserId().then(function (userId) {
                UserService.GetCurrent(userId).then(function (user) {
                        vm.user = user;
                        getAll();
                    });
            });
        }

        function getAll()
        {
            ServerService.GetAll().then(function (ServerList) {
                //vm.ServerList = ServerList;
                for(var s of ServerList)
                {
                  vm.ServerList.push({'ip':s.ip, 'host':s.host, 'status':getServerStatus(s.ip)});
                }
            });
        }

        function getServerStatus(ip)
        {
          CommandService.getStatus(ip).then(function (Status) {
              if(Status == "1")
                return "UP";
              else
                return "DOWN";
          });
        }
})();
