(function () {
    'use strict';

    angular
        .module('app')
        .factory('CommandService', Service);

    function Service($http, $q) {
        var apiURL = "http://localhost:9050/api/command";
        var service = {};

        service.GetToken = GetToken;
        service.GetUserId = GetUserId;
        service.GetCurrent = GetCurrent;
        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        
        return service;

        function GetUserId() {
            // get userId token from server
            return $.get('/app/userId');
        }

        function GetToken() {
            // get userId token from server
            return $.get('/app/token');
        }

        function GetVersion() {
            return $http.get(apiURL + '/version').then(handleSuccess, handleError);
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
        
    }

})();
