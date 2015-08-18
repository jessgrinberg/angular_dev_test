var app = angular.module('endorphNews', ['ui.router'])


	app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

	  $stateProvider
	    .state('home', {
	      url: '/home',
	      templateUrl: '/home.html',
	      controller: 'MainCtrl',
	      resolve: {
    		postPromise: ['posts', function(posts){
      		return posts.getAll();
    	  	}]
  		   }
	    })

	    .state('posts', {
		  url: '/posts/{id}',
		  templateUrl: '/posts.html',
		  controller: 'PostsCtrl',
		  resolve: {
    	  		post: ['$stateParams', 'posts', function($stateParams, posts) {
      			return posts.get($stateParams.id);
    	  	}]
  		  }
		});

	  $urlRouterProvider.otherwise('home');
	}])



	app.factory('posts', ['$http' ,function($http ){
	  var o = {
	    posts: []
	  };

		o.getAll = function() {
			return $http.get('/posts').success(function(data){
			angular.copy(data, o.posts);
		});
	  };

	  o.create = function(post) {
		  return $http.post('/posts', post).success(function(data){
		    o.posts.push(data);
		  });
	  };

	  o.upvote = function(post) {
		  return $http.put('/posts/' + post._id + '/upvote')
		    .success(function(data){
		      post.upvotes += 1;
		    });
	  };

o.get = function(id) {
  return $http.get('/posts/' + id).then(function(res){
    return res.data;
  });
};

o.addComment = function(id, comment) {
  return $http.post('/posts/' + id + '/comments', comment);
};



	  return o;

	




	}])




	app.controller('MainCtrl', [
		'$scope',
		'posts',
		function($scope, posts){
  		// $scope.test = 'Hello world!';

  		$scope.posts = posts.posts;

  // 		$scope.posts = [
		//   {title: 'post 1', upvotes: 5},
		//   {title: 'post 2', upvotes: 2},
		//   {title: 'post 3', upvotes: 15},
		//   {title: 'post 4', upvotes: 9},
		//   {title: 'post 5', upvotes: 4}
		// ];

		$scope.addPost = function(){
		  if(!$scope.title || $scope.title === '') { return; }
		  
		// $scope.posts.push({
		//   title: $scope.title,
		//   link: $scope.link,
		//   upvotes: 0,
		//   comments: [
		//     {author: 'Joe', body: 'Cool post!', upvotes: 0},
		//     {author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
		//   ]
		// });

			posts.create({
		    title: $scope.title,
		    link: $scope.link,
		  });
		  $scope.title = '';
		  $scope.link = '';
		};

		$scope.incrementUpvotes = function(post) {
  			posts.upvote(post);
		};

}])

		app.controller('PostsCtrl', [
		'$scope',
		'posts',
		'post',
		function($scope, posts, post){
			$scope.post = post;

		$scope.addComment = function(){
				  if($scope.body === '') { return; }
				  $scope.post.comments.push({
				    body: $scope.body,
				    author: 'user',
				    upvotes: 0
				  });
				  $scope.body = '';
		};

// $scope.addComment = function(){
//   if($scope.body === '') { return; }
//   posts.addComment(post._id, {
//     body: $scope.body,
//     author: 'user',
//   }).success(function(comment) {
//     $scope.post.comments.push(comment);
//   });
//   $scope.body = '';
// };

		}]);




