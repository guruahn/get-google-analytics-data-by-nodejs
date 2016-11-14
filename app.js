
// Copyright 2015-2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
/*eslint-env node */

'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var urlencode = require('urlencode');
var google = require('googleapis');
var Q = require('q');

/*Google API Console Service Account ID*/
var SERVICE_ACCOUNT_EMAIL = 'yourservice-000@example.iam.gserviceaccount.com';
/*Google API Console Service Account Key*/
var SERVICE_ACCOUNT_KEY_FILE = __dirname + '/key.pem'

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/joel', function (req, res) {
	send(res);
	return;
});

app.get('/joel', function (req, res) {
	send(res);
	return;
});

function send (res){
	GetGaData().then(function(result){
    res.status(200).json({"text": JSON.stringify(result[1])});
  });
};

var GetGaData = function () {
  var analytics = google.analytics('v3');
  var deferred = Q.defer();
  var authClient = new google.auth.JWT(
      SERVICE_ACCOUNT_EMAIL,
      SERVICE_ACCOUNT_KEY_FILE,
      null, ['https://www.googleapis.com/auth/analytics.readonly']);
  
  
  authClient.authorize(function (err, tokens) {
    if (err) {
      console.log("err is: " + err);
      return;
    }

    var params = {
      'auth': authClient,
      'ids': 'ga:********',
      'metrics': 'ga:pageviews',
      'start-date': 'yesterday',
      'end-date': 'yesterday',
      "dimensions": 'ga:date'
    }
    
    analytics.data.ga.get(params, function (err, data) {
    	if(err){
    		console.log(err);
    		return false;
    	}
    	if(data.rows){
    		deferred.resolve(data.rows[0]);
    	}
    });
  });
  return deferred.promise;
}
	

if (module === require.main) {
  // [START server]
  var server = app.listen(process.env.PORT || 9090, function () {
    var port = server.address().port;
    console.log('App listening on port %s', port);
  });
  // [END server]
}

module.exports = app;