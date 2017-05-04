
var scopeHolder;

function showPage() {
    document.getElementById("loader").style.display = "none";
    document.getElementById("loader-wrapper").style.display = "none";
}

function hasVolume(volume) {
    return volume >= 1;
}

window.onscroll = function (ev) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        console.log('you\'re at the bottom of the page');
        if (hours == 0) {

            console.log('hours: ' + hours);
            year = year;
            month = month;
            console.log('day: ' + day);
            day = day - 1;
            console.log('day: ' + day);
            //var time='00:00';
            hours = '23';

            console.log('hours: ' + hours);
            var defMonth = month;
            defMonth += 1;
            if (defMonth < 10) { //concats 0 to the front of a single digit number of month to fit MM/DD/YYYY
                defMonth = "0" + defMonth;
            }
            var defDay = day;
            if (defDay < 10) {//concats 0 to the front of a single digit number of day to fit MM/DD/YYYY
                defDay = "0" + defDay;
            }
            var defDate = defMonth + "/" + defDay + "/" + year;
            document.getElementById('date').value = defDate;

        }
        else {
            console.log('hours: ' + hours);
            hours = hours - 1;
        }

        if (hours < 10) {
            document.getElementById('0' + hours + ':00').click();
        }
        else
            document.getElementById(hours + ':00').click();
        var myDate = new Date(year, month, day, hours, 10, 0, 0);
        var myEpoch = myDate.getTime();

        fullEpochTime = myEpoch;
        scopeHolder.showTweets(0);
        $('html, body').animate({ scrollTop: 0 }, 'slow', function () {
            //alert("reached top");
        })

    }

};

/*Date Picker*/
$('#sandbox-container input').datepicker({
    orientation: "bottom left",
    maxViewMode: 2,
    todayBtn: "linked",
    clearBtn: true,
    todayHighlight: true,
    toggleActive: true,
    orientation: "bottom-middle"
});

//Endless Scrolling in sup ID
$(document).ready(function () {
    $("#sup").scroll(function () {
        var $this = $(this);
        var height = this.scrollHeight - $this.height();
        var scroll = $this.scrollTop();
        var isScrolledToEnd = (scroll >= height);
        $(".scroll-pos").text(scroll);
        $(".scroll-height").text(height);
        if (isScrolledToEnd) {
            console.log("Sup im at the end");
            //Grab the div scope...
            var microappscope = angular.element(document.getElementById('sup')).scope();
            //Load two tweets instead of just one.... One makes scrolling slow
            //Function to grab more tweets needed below.
            microappscope.$apply(microappscope.moreTweets());
        }
    });
});

angular.module('tweetsList', ['ui.bootstrap', "chart.js"])
    .controller('TweetsController', function ($scope, $http) {
        var currTime = -1;
        scopeHolder = $scope;

        $http.get('/api/times').then(function (posts) {
            console.log(posts.data[0].trends)
            console.log(posts)
            //  var memes = document.getElementById(times).innerHTML(posts.data);
        })

        $scope.showTweets = function (trend) {
            console.log(fullEpochTime)

            if (currTime != fullEpochTime) {
                console.log("tweets request");

                //unhard code this
                $http.get('/api/trends/' + fullEpochTime).then(function (posts) {
                    console.log(posts);
                    currTime = fullEpochTime;
                    $scope.allPosts = posts.data.trends;
                    $scope.tweets = $scope.allPosts[trend].tweets
                })
            } else {
                $scope.tweets = $scope.allPosts[trend].tweets
            }
        }

        $scope.labels = ["12:00 AM", "1:00 AM", "2:00 AM", "3:00 AM", "4:00 AM", "5:00 AM", "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM"];

        $scope.onClick = function (points, evt) {
            console.log(points, evt);
        };

        $scope.showDayTrends = function () {
            var tempDate = new Date(year, month, day, 0, 0, 0, 0);
            var dayTrendEpoch = tempDate.getTime();
            console.log('in angular year: ' + year + ' month: ' + month + ' day: ' + day);
            $http.get('/api/daytrends/' + dayTrendEpoch).then(function (posts) {
                console.log('All day trends below');
                console.log(posts.data);
                var result = [];
                for (var i = 0; i < posts.data.length; i++) {
                    var item = posts.data[i];
                    var t = new Date(item.date);
                    result[t.getHours()] = item;
                }
                $scope.daytrends = result;
                $scope.updateChart();
            })
        }

        $scope.updateChart = function () {
            var trends = $scope.daytrends;

            var hashtags = [];
            for (i = 0; i < trends.length; i++) {
                if (trends[i]) {
                    for (y = 0; y < 5; y++) {
                        if (hashtags.indexOf(trends[i].trends[y].trend) < 0) {
                            index = hashtags.push(trends[i].trends[y].trend);
                        }
                    }
                }
            }

            $scope.series = hashtags;
            var datas = [[]];

            for (i = 0; i < $scope.labels.length; i++) {
                var tempHashes = [];
                var times = [];

                if (i < trends.length && trends[i]) {
                    for (y = 0; y < 5; y++) {
                        //  console.log(i);
                        tempHashes.push(trends[i].trends[y].trend);
                        times.push(trends[i].trends[y].tweet_volume);

                    }
                    for (z = 0; z < hashtags.length; z++) {
                        if (!datas[z]) {
                            datas.push([]);
                        }
                        if (tempHashes.indexOf(hashtags[z]) < 0) {
                            datas[z][i] = 0;
                        } else {

                            if (times[tempHashes.indexOf(hashtags[z])] != null) {
                                datas[z][i] = times[tempHashes.indexOf(hashtags[z])];
                            } else {
                                datas[z][i] = 0;
                            }
                        }
                    }
                }
            }

            $scope.data = datas;
            /*if($scope.data[0].find(hasVolume)>=1){
              document.getElementById("chart-container").style.display = "block";
            }
            else{
              document.getElementById("chart-container").style.display = "none";
            }*/

        }

        $scope.getSearch = function () {
          searchTerm = document.getElementById("searchQ").value;
          var finalData= [];
          console.log(searchTerm);
          $http.get('/api/search/'+searchTerm).then(function (posts) {
            var tempData= posts.data;
            for(s = 0; s<tempData.length; s++){
              if(tempData[s].trends.length>0)
                finalData.push({trend:tempData[s].trends[0].trend,date:tempData[s].date});
                
            }
             
             $scope.searchResults = finalData;
          })
        }


        /*$scope.moreTweets = function (trend) {
            $http.get('/api/trends/' + fullEpochTime).then(function (posts) {
                console.log(posts.data[0].trends[1].tweets)
                //This is just an example... Im not sure how to grab the next set of 90 tweets wtihin the same trend???
                tweets.info = tweets.info.concat(posts.data[0].trends[1].tweets);
                //tweets.info.push(posts.data[0].trends[1].tweets);
            })
        }*/

    });
