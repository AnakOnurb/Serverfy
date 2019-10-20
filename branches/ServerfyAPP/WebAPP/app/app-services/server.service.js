(function () {
    'use strict';

    angular
        .module('app')
        .factory('ServerService', Service);

    function Service($http, $q) {
        var apiURL = "http://localhost:9050/api/Server";
        var service = {};

        service.GetToken = GetToken;
        service.GetUserId = GetUserId;
        service.GetCurrentUser = GetCurrentUser;
        service.GetAll = GetAll;
        service.GetById = GetById;
        service.SearchByName = SearchByName;
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

        function GetCurrentUser(userId) {
            return $http.get(apiURL + '/' + userId).then(handleSuccess, handleError);
        }

        function GetAll() {            
            return $http.get(apiURL + '/').then(handleSuccess, handleError);
        }

        function GetById(_id) {
            return $http.getapiURL + (apiURL + '/' + _id).then(handleSuccess, handleError);
        }

        function SearchByName(serverName) {
            return $http.get(apiURL + '/' + serverName).then(handleSuccess, handleError);
        }

        function Create(server) {
            return $http.post(apiURL + '/addserver', server).then(handleSuccess, handleError);
        }

        function Update(server) {
            return $http.put(apiURL + '/' + server._id, server).then(handleSuccess, handleError);
        }

        function Delete(_id) {
            return $http.delete(apiURL + '/' + _id).then(handleSuccess, handleError);
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
