angular.module('givagoApp')
    .factory('Video', function($http) {

        //+ Jonas Raoni Soares Silva
        //@ http://jsfromhell.com/array/shuffle [v1.0]
        function shuffle(o)
        {   //v1.0
            for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
            return o;
        }

        return {
            getAll: function() {
                return shuffle([
                    {
                        id: 1,
                        name: 'Fairphone',
                        ytid: 'hIR3VW5DQ_o',
                        thumb: '0',
                        tag: 'New Technology',
                        sponsor: {
                            id: 'fairephone',
                            name: 'Fairphone',
                            logo: {url: '/images/fairphone-logo.png'},
                            description: 'Fairphone is a social enterprise working to create a fairer economy and change how things are made. They open up supply chains, solve problems and use transparency to start debate about what’s truly fair.',
                            social: [
                                {type: 'youtube', url: 'https://www.youtube.com/user/Fairphone'},
                                {type: 'facebook', url: 'https://www.facebook.com/Fairphone'},
                                {type: 'twitter', url: 'https://twitter.com/fairphone'},
                                {type: 'flickr', url: 'https://www.flickr.com/photos/fairphone'}
                            ]
                        }
                    }, {
                        id: 2,
                        name: 'FairTrade',
                        ytid: '4tvLHDxv4B4',
                        thumb: '0',
                        tag: 'Fair Trade',
                        sponsor: {
                            id: 'fairetrade',
                            name: 'FairTrade',
                            logo: {url: '/images/Fairtrade.png', style: 'max-height:100px;'},
                            description: 'Fair trade is an alternative approach to conventional trade based on a partnership between producers and traders, businesses and consumers. The international Fairtrade system - made up of Fairtrade International and its member organizations - represents the world\'s largest and most recognized fair trade system.',
                            social: [
                                {type: 'youtube', url: 'https://www.youtube.com/user/fairtradeintl'},
                                {type: 'facebook', url: 'https://www.facebook.com/fairtrade'},
                                {type: 'twitter', url: 'https://twitter.com/fairtrade'},
                                {type: 'tumblr', url: 'http://fairtrade.tumblr.com/'},
                                {type: 'google-plus', url: 'https://plus.google.com/104716744526771516490/posts'}
                            ]
                        }
                    }, {
                        id: 4,
                        name: 'Elephant Branded',
                        ytid: 'f6k4hExAxK8',
                        thumb: '0',
                        tag: 'Education',
                        sponsor: {
                            id: 'elephant-branded',
                            name: 'Elephant Branded',
                            logo: {url: '/images/logo-elephant-branded.png', style: 'max-height:100px;'},
                            description: 'Why do some children have the right to an education whilst others don\'t? One Elephant... One Idea. By buying one of their products, Branded Elephant donates school kit to children in Africa or Asia.',
                            social: [
                                {type: 'youtube', url: 'https://www.youtube.com/user/elephantbranded'},
                                {type: 'facebook', url: 'https://www.facebook.com/ElephantBranded'},
                                {type: 'twitter', url: 'https://twitter.com/elephantbranded'},
                                {type: 'flickr', url: 'https://www.flickr.com/photos/elephantbranded'},
                                {type: 'instagram', url: 'http://instagram.com/elephantbranded'}
                            ]
                        }
                    }, {
                        id: 5,
                        name: 'Café Direct',
                        ytid: '-Gq5edVwxhw',
                        thumb: '0',
                        tag: 'Coffee',
                        sponsor: {
                            id: 'cafe-direct',
                            name: 'Café Direct',
                            logo: {url: '/images/logo-cafe-direct.png', style: 'max-height:100px;'},
                            description: 'At Cafédirect we believe things that are made better taste better, which is why we only work directly with expert smallholders to create our award winning range of tea, coffee and hot chocolate. ',
                            social: [
                                {type: 'youtube', url: 'https://www.youtube.com/user/CafedirectTV'},
                                {type: 'facebook', url: 'https://www.facebook.com/cafedirect'},
                                {type: 'twitter', url: 'https://www.youtube.com/user/CafedirectTV'},
                                {type: 'pinterest', url: 'https://www.pinterest.com/cafedirect/'}
                            ]
                        }
                    }
                ]);
            }

        };
    });