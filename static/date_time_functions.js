var year='';
var month='';
var day='';
var hours='';

function defDate(){
  var epochDate = Date.now();
  fullEpochTime = epochDate;
  var humanDate = new Date(epochDate)
  year = humanDate.getFullYear();
  month = humanDate.getMonth();
  day = humanDate.getDate();
  hours = humanDate.getHours();
  var defMonth = month;
  defMonth += 1;
  if(defMonth < 10){ //concats 0 to the front of a single digit number of month to fit MM/DD/YYYY
    defMonth = "0" + defMonth;
  }
  var defDay = day;
    if(defDay < 10){//concats 0 to the front of a single digit number of day to fit MM/DD/YYYY
      defDay = "0" + defDay;
  }
  var defDate = defMonth+"/"+defDay+"/"+year;

  document.getElementById('date').value = defDate;
  if(hours<10){
      document.getElementById('0'+hours+':00').click();
  }
  else{
    document.getElementById(hours+':00').click();
  }

  scopeHolder.showDayTrends();

}

function setDate(){
  var temp = document.getElementById('date').value; //04/06/2017
  month = temp.substr(0, 2);
  month = parseInt(month);
  month = month-1;
  day = temp.substr(3, 2);
  year = temp.substr(6, 9);
  var myDate = new Date(year,month,day,hours,10,0,0);
  var myEpoch = myDate.getTime();

  if(fullEpochTime!=myEpoch){
    fullEpochTime = myEpoch;
    scopeHolder.showTweets(0);
    scopeHolder.showDayTrends();
  }
}


//when you click on timeline
function setTime(e){
  var temp = e.target.id
  hours=temp.substr(0, 2);
  var myDate = new Date(year,month,day,hours,10,0,0);
  var myEpoch = myDate.getTime();

  if(fullEpochTime!=myEpoch){
    fullEpochTime = myEpoch;
    scopeHolder.showTweets(0);
  }

}
