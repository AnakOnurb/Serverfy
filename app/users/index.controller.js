(function () {
    'use strict';

    angular
        .module('app')
        .controller('User.IndexController', Controller);

    function Controller($window, UserService, FlashService) {
        var vm = this;

        vm.UserList = null;
        vm.User = null;

        vm.newUser = newUser;
        vm.saveUser = saveUser;
        vm.deleteUser = deleteUser;
        vm.getUser = getUser;
        vm.calcMargin = calcMargin;

        var creating = false;

        getAll();

        function getAll()
        {
            UserService.GetAll().then(function (UserList) {
                vm.UserList = UserList;
            });
        }

        function newUser()
        {
            creating = true;
            clearElements();
            //document.getElementById('code').value = getLast();
        }

        function createUser()
        {
            vm.User = null;
            fillUser(false);
            UserService.Create(vm.User)
                .then(function () {
                    FlashService.Success('User created');
                    getAll();
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function saveUser()
        {
            if(creating) //insert
            {
                createUser();
                creating = false;
            }
            else //update
            {
                fillUser(true);
                UserService.Update(vm.User)
                    .then(function () {
                        FlashService.Success('User updated');
                        getAll();
                    })
                    .catch(function (error) {
                        FlashService.Error(error);
                    });
            }
        }

        function deleteUser()
        {
            if(creating) //erase info
            {
                vm.User = null;
                clearElements();
                creating = false;
            }
            else //delete
            {
                fillUser(true);
                UserService.Delete(vm.User._id)
                    .then(function () {
                        vm.User = null;
                        getAll();
                        clearElements();
                        FlashService.Success('User deleted');
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
            return (Number(vm.UserList[Object.keys(vm.UserList).length - 1].code) + 1);
        }*/

        function getUser(UserCode)
        {
            for(var key in vm.UserList)
            {
                var User = vm.UserList[key];
                if(User._id == UserCode)
                {
                    vm.User = User;
                    fillElements();
                    creating = false;
                }
            }
        }

        function fillElements()
        {
            document.getElementById('ip').value = vm.User.ip;
            document.getElementById('host').value = vm.User.host;
        }

        function fillUser(withId)
        {
            if(!withId)
            {
                vm.User = {
                    ip: document.getElementById('ip').value,
                    host: document.getElementById('host').value
                };
            }
            else
            {
                var id = vm.User._id;
                vm.User = {
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
