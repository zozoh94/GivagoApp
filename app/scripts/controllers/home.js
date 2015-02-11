angular.module('givagoApp')
    .controller('HomeCtrl', function ($scope, $sce, $q, $document){

        $scope.gifts = [
            {id: 'tree', name: 'Plant a tree', icon: 'tree'},
            {id: 'food', name: 'Feed someone', icon: 'spoon'},
            {id: 'water', name: 'Give a drink', icon: 'tint'}
        ];

        $scope.scrollToContent = function()
        {
            var contentContainer = angular.element(document.getElementById('content-container'));

            $document.scrollTo(contentContainer, 0, 800);
        };
    }
);