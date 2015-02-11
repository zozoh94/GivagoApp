angular.module('givagoApp')
    .controller('HomeCtrl', function ($rootScope, $scope, $sce, $q, $document){

        $scope.gifts = [
            {name: 'Tree', icon: 'glyphicon glyphicon-tree-deciduous fa-stack-1x'},
            {name: 'Food', icon: 'fa fa-spoon fa-stack-1x'},
            {name: 'Water', icon: 'fa fa-tint fa-stack-1x'}
        ];



        $scope.scrollToContent = function()
        {
            var contentContainer = angular.element(document.getElementById('content-container'));

            $document.scrollTo(contentContainer, 0, 800);
        };
    }
);