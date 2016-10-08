function setCookie(cname, cvalue, exdays) {
	var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length,c.length);
    }
  }
  return "";
}

function checkCookie() {
  var user = getCookie("owner");
  if (user != "") {
    // alert("Welcome again " + user);
  } else if (window.location.href.indexOf("login") == -1) {
    window.location = "/login";
  }
}

function setOwner(owner) {
  setCookie("owner", owner, 120);
  window.location = "/";
}