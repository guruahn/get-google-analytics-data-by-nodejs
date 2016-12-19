#Get GoogleGA Data by NodeJS

- Author: [Jeong Woo Ahn](https://medium.com/@jeongwooahn)
- Stable tag: 1.0
- License: GPLv2 or later
- License URI: http://www.gnu.org/licenses/gpl-2.0.html

## Description
NodeJS로 Google Analytics에 연결하여 데이터를 조회하는 기본 코드이다. 기본 세팅은 [nodejs-getting-started/1-hello-world](https://github.com/GoogleCloudPlatform/nodejs-getting-started/blob/master/1-hello-world/)에서 가져왔다.

##사용된 패키지들
```
"dependencies": {
    "body-parser": "^1.15.2",
    "express": "^4.14.0",
    "node-rest-client": "2.0.1",
    "node-schedule": "0.1.8",
    "googleapis": "^14.1.0",
    "q": "^1.4.1",
    "urlencode": "1.1.0"
},
"devDependencies": {
    "cors": "^2.8.1",
    "mocha": "^3.0.2",
    "nodejs-repo-tools": "git+https://github.com/GoogleCloudPlatform/nodejs-repo-tools.git#21daa823090c43fb667157c8b5b0c3b7f45a8357",
    "supertest": "^2.0.0"
}
```
1. [body-parser](https://github.com/expressjs/body-parser), urlencode : Node.js 바디를 파싱해주는 미들웨어. 클라이언트에서 온 Request의 바디부분을 req.body 프로퍼티안에 파싱해준다.
2. [express](http://expressjs.com/ko/) : Node.js를 위한 빠르고 개방적인 간결한 웹 프레임워크
3. [node-rest-client](https://www.npmjs.com/package/node-rest-client) : [nodejs-getting-started/1-hello-world](https://github.com/GoogleCloudPlatform/nodejs-getting-started/blob/master/1-hello-world/)에 기본으로 들어있는 패키지. HTTP GET요청을 보내고 응답받는 로직을 손쉽게 구현할 수 있다. 여기서는 사용하지 않았지만 매우 유용하다.
4. [node-schedule](https://www.npmjs.com/package/node-schedule) : 역시 [nodejs-getting-started/1-hello-world](https://github.com/GoogleCloudPlatform/nodejs-getting-started/blob/master/1-hello-world/)에 기본으로 들어있는 패키지. 리눅스의 크론잡같은 역할을 하는듯. 여기서는 사용하지 않았지만 매우 유용하다.
5. [googleapis](https://www.npmjs.com/package/googleapis) : 구글 공식 지원하는 구글  API Node.js 라이브러리이다.
6. [q](https://www.npmjs.com/package/q) : 프로미스 구현을 위한 라이브러리이다.
7. [cors](https://www.npmjs.com/package/cors) : 브라우저에서 이 서비스를 통해 데이터를 가져가도록 구현하려면 CORS문제를 해결해야할텐데 이를 매우 쉽게 해준다. [Express](http://expressjs.com/ko/)/[Connect](http://www.senchalabs.org/connect/) 어플리케이션 안에서 사용할 수 있는 미들웨어.

나머지 모듈은 구글 클라우드에 배포하거나 테스트하는 모듈인데 아직 사용해보지 않아서 설명을 추가로 달지는 않았다. 하지만 유용할듯하니 남겨둔다.

## Installation
###1. [Google Api Console 서비스 계정(service account) 만들기](https://developers.google.com/identity/protocols/OAuth2#serviceaccount)

![service account setting](https://dl.dropboxusercontent.com/u/38351999/gongjam/blog/installation1.jpeg)

반드시 `비공개 키 제공`에 체크표시를 해야한다. 만들기를 누르면 파일이 다운될 것이다. 이 파일은 아래 키파일 변환에서 사용할 것이다.

###2. 키파일 변환(key.p12 to key.pem)
아래 명령어를 통해 위에서 받은 키파일을 변환한다.
```
openssl pkcs12 -in key.p12 -nodes -nocerts > key.pem
```

###3. 계정정보 입력
SERVICE_ACCOUNT_EMAIL에는 위에서 생성된 서비스 계정의 아이디를, SERVICE_ACCOUNT_KEY_FILE에는 위에서 변환한 `key.pem`파일의 경로를 입력한다.
```
/*Google API Console Service Account ID*/
var SERVICE_ACCOUNT_EMAIL = 'yourservice-000@example.iam.gserviceaccount.com';
/*Google API Console Service Account Key*/
var SERVICE_ACCOUNT_KEY_FILE = __dirname + '/key.pem'
```

###4. Google Analytics 설정
위에서 얻은 SERVICE_ACCOUNT_EMAIL에 데이터 접근 권한을 줘야한다. 관리 > 계정 > 사용자관리 화면으로 이동한 후 하단에 `다음 사용자에게 권한 추가` 폼을 통해 해당 이메일 계정을 등록해야한다.

![add permission](https://dl.dropboxusercontent.com/u/38351999/gongjam/blog/installation4.jpeg)

###5. Google Analytics Api 파라미터 세팅
```nodejs
var params = {
  'auth': authClient,
  'ids': 'ga:********',
  'metrics': 'ga:sessions',
  'start-date': '5daysAgo',
  'end-date': 'today',
  'dimensions': 'ga:date'
}
```
- **authClient** : 키파일과 얻고자하는 권한 정보가 담겨있는 객체이다.
- **ids** : Anaytics view id(한글로 보기 ID)라고 하며 `ga:` prefix와 함께 쓴다. 구글분석도구 관리페이지에서 찾을 수 있는데 처음에는 찾기 쉽지않다. 계정ID로 착각하기 쉬운데 아니다. 아래 그림을 보면,
![find google analytics view id #1](https://dl.dropboxusercontent.com/u/38351999/gongjam/blog/installation2.jpeg)
위처럼 관리자 화면에서 반드시 계정, 속성, 보기를 잘 선택한 후 `설정 보기`를 클릭한다. 그러면 아래와 같은 화면을 확인할 수 있을 것이다. 아래 화면에서 보기ID를 카피하면 된다.
![find google analytics view id #2](https://dl.dropboxusercontent.com/u/38351999/gongjam/blog/installation3.jpeg)
더 자세한 안내가 필요하다면 [Find your Google Analytics Tracking ID & View ID](https://lucidpress.zendesk.com/hc/en-us/articles/207335356-Find-your-Google-Analytics-Tracking-ID-View-ID)를 볼것.

- **metrics와 dimensions** 속성은 Google Analytics로부터 얻고자하는 데이터의 타입에 대한 정보를 담고 있으며 위 예시에서는 웹사이트의 세션 수를 날짜별(x축)로 얻을 수 있다. 이는 [쿼리 탐색기](https://ga-dev-tools.appspot.com/query-explorer/)를 통해 테스트해볼 수 있고, 몇 번 해보면 직관적으로 이해가 될 것이다. 이 속성에 어떤 값을 세팅할 수 있는지는 [Dimensions & Metrics Explorer](https://developers.google.com/analytics/devguides/reporting/core/dimsmets)를 통해 검색할 수 있다.
- **start-date, end-date** : 데이터 쿼리를 보낼때 날짜 범위를 설정한다. 하루 단위를 보고 싶다면 두 속성을 동일한 날짜로 설정하면 된다.

###6. 설치
```
$ npm start
```

## 참고
- [nodejs-getting-started/1-hello-world](https://github.com/GoogleCloudPlatform/nodejs-getting-started/blob/master/1-hello-world/)
- [Google APIs Node.js Client](https://github.com/google/google-api-nodejs-client/)
- [Using Google Analytics with Node.JS](http://www.fsjohnny.com/using-google-analytics-api-with-node-js/)
- [Q모듈을 활용한 Promise 사용하기](https://medium.com/@jungseobshin/node-js-callback-hell-%ED%83%88%EC%B6%9C%ED%95%98%EA%B8%B0-%EB%B6%80%EC%9E%AC-q%EB%AA%A8%EB%93%88%EC%9D%84-%ED%99%9C%EC%9A%A9%ED%95%9C-promise-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0-9c13e0081ba5#.lyojpklw1)
- [OAuth 2.0 Service accounts](https://developers.google.com/identity/protocols/OAuth2#serviceaccount)
- [Dimensions & Metrics Explorer](https://developers.google.com/analytics/devguides/reporting/core/dimsmets)
- [Query Explorer](https://ga-dev-tools.appspot.com/query-explorer/)
- [Find your Google Analytics Tracking ID & View ID](https://lucidpress.zendesk.com/hc/en-us/articles/207335356-Find-your-Google-Analytics-Tracking-ID-View-ID)
