(function () {
    'use strict';

    angular
        .module('app')
        .factory('CommandService', Service);

    function Service($http, $q) {
        var apiURL = "https://serverfyapi.azurewebsites.net/api/command";
        var service = {};

        service.GetToken = GetToken;
        service.GetUserId = GetUserId;
        service.GetVersion = GetVersion;
        service.GetStatus = GetStatus;

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

        function GetStatus(ip) {
            return $http.get(apiURL + '/status' + ip).then(handleSuccess, handleError);
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
