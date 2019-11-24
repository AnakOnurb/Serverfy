(function () {
    'use strict';

    angular
        .module('app')
        .controller('Server.IndexController', Controller);

    function Controller($window, ServerService, FlashService) {
        var vm = this;

        vm.ServerList = null;
        vm.Server = null;

        vm.newServer = newServer;
        vm.saveServer = saveServer;
        vm.deleteServer = deleteServer;
        vm.getServer = getServer;
        vm.calcMargin = calcMargin;

        var creating = false;

        getAll();

        function getAll()
        {
            ServerService.GetAll().then(function (ServerList) {
                vm.ServerList = ServerList;
            });
        }

        function newServer()
        {
            creating = true;
            clearElements();
            //document.getElementById('code').value = getLast();
        }

        function createServer()
        {
            vm.Server = null;
            fillServer(false);
            ServerService.Create(vm.Server)
                .then(function () {
                    FlashService.Success('Server created');
                    getAll();
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function saveServer()
        {
            if(creating) //insert
            {
                createServer();
                creating = false;
            }
            else //update
            {
                fillServer(true);
                ServerService.Update(vm.Server)
                    .then(function () {
                        FlashService.Success('Server updated');
                        getAll();
                    })
                    .catch(function (error) {
                        FlashService.Error(error);
                    });
            }
        }

        function deleteServer()
        {
            if(creating) //erase info
            {
                vm.Server = null;
                clearElements();
                creating = false;
            }
            else //delete
            {
                fillServer(true);
                ServerService.Delete(vm.Server._id)
                    .then(function () {
                        vm.Server = null;
                        getAll();
                        clearElements();
                        FlashService.Success('Server deleted');
                    })
                    .catch(function (error) {
                        FlashService.Error(error);
                    });
            }
        }

        function clearElements()
        {
            var clear = document.getElementsByClassName("clear");
            for(let e of clear)
            {
                e.value = "";
            }
        }

        /*function getLast()
        {
            return (Number(vm.ServerList[Object.keys(vm.ServerList).length - 1].code) + 1);
        }*/

        function getServer(ServerCode)
        {
            for(var key in vm.ServerList)
            {
                var Server = vm.ServerList[key];
                if(Server._id == ServerCode)
                {
                    vm.Server = Server;
                    fillElements();
                    creating = false;
                }
            }
        }

        function fillElements()
        {
            document.getElementById('ip').value = vm.Server.ip;
            document.getElementById('host').value = vm.Server.host;
        }

        function fillServer(withId)
        {
            if(!withId)
            {
                vm.Server = {
                    ip: document.getElementById('ip').value,
                    host: document.getElementById('host').value
                };
            }
            else
            {
                var id = vm.Server._id;
                vm.Server = {
                    _id: id,
                    ip: document.getElementById('ip').value,
                    host: document.getElementById('host').value
                };
            }
        }

        function calcMargin()
        {
            document.getElementById('marginprice').value = Number(document.getElementById('pricepaid').value) * 2;
        }
    }

})();
