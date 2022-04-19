//express는 서버를 만들기 위한 프레임워크
const express = require("express");
//express 실행
const app = express();

//현재 도메인과 다른 도메인으로 리소스가 요청될 경우를 cors라고 함.
//Cross Origin Resource Sharing
const cors = require("cors");

//동일 도메인이 아니더라도 접근할 수 있도록 cors를 허용함.
//cors를 허용안하면 포트번호 3000번의 react에서 8080의 nodejs로 요청/응답을 할 수 없다.

//session 사용
const session = require("express-session");

const connect = require("./schemas");

connect();

const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(
  session({
    resave: false,
    saveUnitialized: true,
    secret: "myboard",
  })
);
//secret은 세션을 암호화
//resave: 세션을 항상 저장할지 여부를 정하는값
//saveUnitialized : 초기화되지 않은채 스토어에 저장되는 세션

//express 에서 사용할 설정
app.use(cors(corsOptions));

//data를 주고받을 때 json파일을 이용해 주고받겠다.
app.use(express.json());

//배열같은 데이터를 받아오기 위한 설정
app.use(express.urlencoded({ extended: true }));

//라우터를 이용해 파일 분리해주기W
//라우터 설정해줄 js 파일에서 router 설정을 해줘야함
app.use("/member", require("./routes/memberRouter"));
app.use("/board", require("./routes/boardRouter"));
app.use("/calendar", require("./routes/calendarRouter"));

//포트번호 8080로 접속
app.listen(8080, () => {
  console.log("접속 완료!");
});
