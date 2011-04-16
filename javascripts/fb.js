FB.init({
  appId  : 165971536792687,
  status : true,
  cookie : true,
  xfbml  : true
});

FB.Event.subscribe('auth.login', function(response) {
  console.debug(response);
});
