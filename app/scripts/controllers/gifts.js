angular.module('givagoApp')
    .controller('GiftsCtrl', function ($scope)
    {
        $scope.gifts = [
            {name: 'Plant a tree', icon: 'tree'},
            {name: 'Feed someone', icon: 'spoon'},
            {name: 'Give a drink', icon: 'tint'}
            //{name: 'Educate', icon: 'mortar-board'},
        ];
    }
);