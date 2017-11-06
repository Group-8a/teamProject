$scope.update_count = function() {
      $scope.error = null;
      #connect to Db based off username
      #add count = count+1
      #if count >=3 then go to fail login page

        };
$scope.check_login = function(username, password){
      #hash password with same hash used in creating it for the Database
      #send to controller

      #if boolean is false do update_count
};

#in controller:
exports.update_count = function(req, res){
  #
  #get user by username
  #retrieve count

};

exports.get_password = function(req, res){
  #var username = req.username;
  #var password = req.password;

  #get password by username
  #compare passwords
  #return boolean

};
