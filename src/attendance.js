
var channelUsers = new Array('david','ann','charles','cho.cho','chris','green.kim','joel','jonny','kyle','reeeun','simon','woody','alex','miller');
var attendanceUsers = new Array();
var vacationUsers = new Array();


exports.getUserName = function(){
  return channelUsers;
}
//휴가자 등록
exports.vacationUser = function(name){
  if(vacationUsers.indexOf(name) != -1) return false;
  if(channelUsers.indexOf(name) == -1)return false; //등록된 유저가 아니면
  vacationUsers.push(name);
  return true;
}

//참석자 등록
exports.attendanceUser = function(name){
  if(attendanceUsers.indexOf(name) != -1) return false;
  attendanceUsers.push(name);
  return true;
}

//참석자 리스트
exports.getAttendanceUser = function(){
  return attendanceUsers;
}

//초기화
exports.finish = function(){
  attendanceUsers = new Array();
  vacationUsers = new Array();
}

//미참석자 리스트
exports.nonattendanceUsers = function(){
  var nonattendanceUserList = new Array();

  for(var i in channelUsers){
    if(attendanceUsers.indexOf(channelUsers[i]) == -1){ //출석 유저에도 없고
      if(vacationUsers.indexOf(channelUsers[i]) == -1){//휴가중인 유저도 없으면 불참
        nonattendanceUserList.push(channelUsers[i]);
      }
    }
  }
  return nonattendanceUserList;
}
