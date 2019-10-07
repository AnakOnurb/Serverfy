(function () {
    'use strict';

    angular
        .module('app')
        .factory('InventoryService', Service);

    function Service($http, $q) {
        var apiURL = "http://localhost:9050/api/inventory";
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

        function SearchByName(productName) {
            return $http.get(apiURL + '/' + productName).then(handleSuccess, handleError);
        }

        function Create(product) {
            return $http.post(apiURL + '/addproduct', product).then(handleSuccess, handleError);
        }

        function Update(product) {
            return $http.put(apiURL + '/' + product._id, product).then(handleSuccess, handleError);
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
