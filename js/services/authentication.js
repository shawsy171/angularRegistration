myApp.factory('Authentication', ['$rootScope', '$location','$firebaseObject' ,'$firebaseAuth','FIREBASE_URL',
	function($rootScope, $location, $firebaseObject, $firebaseAuth, FIREBASE_URL) {
	
	var ref = new Firebase(FIREBASE_URL);
	var auth = $firebaseAuth(ref);

	auth.$onAuth(function(authUser) {
		if(authUser) {
			var userRef = new Firebase(FIREBASE_URL + 'users/' + authUser.uid );
			var userObj = $firebaseObject(userRef);
			$rootScope.currentUser = userObj;
		} else {
			$rootScope.currentUser = '';
		}
	});

	var myObject = {
		login: function(user) {
			auth.$authWithPassword({
				email: user.email,
				password: user.password
			})
			.then(function(regUser) {
				$location.path('/success');
			})
			.catch(function(error) {
				$rootScope.message = error.message;
			});	
			$rootScope.message = "Welcome " + user.email;
		},

		logout: function() {
			return auth.$unauth();
		},

		// requireAuth: function() {
		// 	return auth.$requireAuth();
		// },
		requireAuth: function() {
		  return auth.$requireAuth();
		},

		register: function(user) {
			auth.$createUser({
				email: user.email,
				password: user.password
			})
			.then(function(regUser){
				// $rootScope.message = "Welcome " + user.firstname + ' Thank you for registering';
				myObject.login(user);

				var regRef = new Firebase(FIREBASE_URL + 'users') // this creates a new path to Firebase e.g. 'https://angularreg171.firebaseio.com/users'
				.child(regUser.uid).set({
					date: Firebase.ServerValue.TIMESTAMP,
					regUser: regUser.uid,
					firstname: user.firstname,
					lastname:user.lastname,
					email: user.email
				})
			})
			.catch(function(error) {
				$rootScope.message = error.message;
			});	
		}
	};

	return myObject;

}]);