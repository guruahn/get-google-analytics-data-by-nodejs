var dateFormat = require('dateformat');

var startDate = new Date();

exports.getDate_yyyy_mm_dd = function(){
  return dateFormat(new Date(), "yyyy-mm-dd");
}

exports.getHour = function(){
  return dateFormat(new Date(), "H");
}
