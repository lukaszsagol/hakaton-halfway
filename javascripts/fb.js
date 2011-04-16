FB.init({
  appId  : ,
  status : true,
  cookie : true,
  xfbml  : true
});

FB.Event.subscribe('auth.login', function(response) {
  console.debug(response);
});
