exports.getDateString = function(offset) {
  var newDate = new Date();
  newDate.setDate(newDate.getDate() + offset);
  
  var dd = newDate.getDate();
  var mm = newDate.getMonth()+1; //January is 0!
  var yyyy = newDate.getFullYear();

  if(dd<10) {
    dd='0'+dd
  } 

  if(mm<10) {
    mm='0'+mm
  } 

  return mm+'/'+dd+'/'+yyyy;
}

exports.parseQueryString = function(queryString) {
  var params = {}, queries, temp, i, l;
 
  // Split into key/value pairs
  queries = queryString.split("&");
 
  // Convert the array of strings into an object
  for ( i = 0, l = queries.length; i < l; i++ ) {
    temp = queries[i].split('=');
    params[temp[0]] = temp[1];
  }
 
  return params;
};
