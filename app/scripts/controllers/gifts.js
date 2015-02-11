angular.module('givagoApp')
    .controller('GiftsCtrl', function ($scope)
    {
        $scope.gifts = [
            {name: 'Tree', icon: 'glyphicon glyphicon-tree-deciduous'},
            {name: 'Food', icon: 'fa fa-spoon fa-stack-1x'},
            {name: 'Water', icon: 'fa fa-tint fa-stack-1x'}
            //{name: 'Educate', icon: 'mortar-board'},
        ];
    }
);