#Get GoogleGA Data by NodeJS

- Contributors: guruahn
- Donate link: http://gongjam.co.kr/
- Stable tag: 1.0
- License: GPLv2 or later
- License URI: http://www.gnu.org/licenses/gpl-2.0.html

## Description
NodeJS로 Google Analytics에 연결하여 데이터를 조회하는 기본 코드입니다.

## Installation
###1. [Google Api Console 서비스 계정(service account) 만들기](https://developers.google.com/identity/protocols/OAuth2#serviceaccount)

![service account setting](https://dl.dropboxusercontent.com/u/38351999/gongjam/blog/installation1.jpeg)

###2. 키파일 변환(key.p12 to key.pem)
아래 명령어를 통해 위에서 받은 키파일을 변환합니다.
  openssl pkcs12 -in key.p12 -nodes -nocerts > key.pem

###3. 계정정보 입력
SERVICE_ACCOUNT_EMAIL에는 위에서 생성된 서비스 계정의 아이디를, SERVICE_ACCOUNT_KEY_FILE에는 위에서 변환한 `key.pem`파일의 경로를 입력합니다.
  /*Google API Console Service Account ID*/
  var SERVICE_ACCOUNT_EMAIL = 'yourservice-000@example.iam.gserviceaccount.com';
  /*Google API Console Service Account Key*/
  var SERVICE_ACCOUNT_KEY_FILE = __dirname + '/key.pem'

###4. Google Analytics 설정
위에서 얻은 SERVICE_ACCOUNT_EMAIL에 데이터 접근 권한을 줘야한다. 관리 > 계정 > 사용자관리 화면으로 이동한 후 하단에 `다음 사용자에게 권한 추가` 폼을 통해 해당 이메일 계정을 등록해야한다.

![add permission](https://dl.dropboxusercontent.com/u/38351999/gongjam/blog/installation4.jpeg)

###5. Google Analytics Api 파라미터 세팅
  var params = {
    'auth': authClient,
    'ids': 'ga:********',
    'metrics': 'ga:sessions',
    'start-date': '5daysAgo',
    'end-date': 'today',
    'dimensions': 'ga:date'
  }

- authClient : 키파일과 얻고자하는 권한 정보가 담겨있는 객체이다. 
- ids : Anaytics view id를 `ga:` prefix와 함께 쓴다. 구글분석도구 관리페이지에서 찾을 수 있는데 처음에는 찾기 쉽지않다. 계정ID로 착각하기 쉬운데 아니다. 아래 그림을 보면,
![find google analytics view id #1](https://dl.dropboxusercontent.com/u/38351999/gongjam/blog/installation2.jpeg)
위처럼 관리자 화면에서 반드시 계정, 속성, 보기를 잘 선택한 후 `설정 보기`를 클릭한다. 그러면 아래와 같은 화면을 확인할 수 있을 것이다.
![find google analytics view id #2](https://dl.dropboxusercontent.com/u/38351999/gongjam/blog/installation3.jpeg)
더 자세한 안내가 필요하다면 [Find your Google Analytics Tracking ID & View ID](https://lucidpress.zendesk.com/hc/en-us/articles/207335356-Find-your-Google-Analytics-Tracking-ID-View-ID)를 볼것.

- metrics와 dimensions 속성은 Google Analytics로부터 얻고자하는 데이터의 타입에 대한 정보를 담고 있으며 위 예시에서는 웹사이트의 세션 수를 날짜별(x축)로 얻을 수 있다. 이는 [쿼리 탐색기](https://ga-dev-tools.appspot.com/query-explorer/)를 통해 테스트해볼 수 있고, 몇 번 해보면 직관적으로 이해가 될 것이다. 이 속성에 어떤 값을 세팅할 수 있는지는 [Dimensions & Metrics Explorer](https://developers.google.com/analytics/devguides/reporting/core/dimsmets)를 통해 검색할 수 있다.
- start-date, end-date : 데이터 쿼리를 보낼때 날짜 범위를 설정한다. 하루 단위를 보고 싶다면 두 속성을 동일한 날짜로 설정하면 된다.

## 참고
- [Google APIs Node.js Client](https://github.com/google/google-api-nodejs-client/)
- [Using Google Analytics with Node.JS](http://www.fsjohnny.com/using-google-analytics-api-with-node-js/) 
- [Q모듈을 활용한 Promise 사용하기](https://medium.com/@jungseobshin/node-js-callback-hell-%ED%83%88%EC%B6%9C%ED%95%98%EA%B8%B0-%EB%B6%80%EC%9E%AC-q%EB%AA%A8%EB%93%88%EC%9D%84-%ED%99%9C%EC%9A%A9%ED%95%9C-promise-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0-9c13e0081ba5#.lyojpklw1)
- [OAuth 2.0 Service accounts](https://developers.google.com/identity/protocols/OAuth2#serviceaccount)
- [Dimensions & Metrics Explorer](https://developers.google.com/analytics/devguides/reporting/core/dimsmets)
- [Query Explorer](https://ga-dev-tools.appspot.com/query-explorer/)
- [Find your Google Analytics Tracking ID & View ID](https://lucidpress.zendesk.com/hc/en-us/articles/207335356-Find-your-Google-Analytics-Tracking-ID-View-ID)