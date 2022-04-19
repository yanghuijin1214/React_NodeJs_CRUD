const mongoose = require("mongoose");

module.exports = () => {
  const connect = () => {
    if (process.env.NODE_ENV !== "production") {
      mongoose.set("debug", true);
    }
    //mongoose 연결
    mongoose.connect(
      //mongodb의 til이라는 db에 접근하겠다.
      "mongodb://localhost:27017/til",
      {
        dbName: "til",
      },
      (error) => {
        //에러처리
        if (error) {
          console.log("MongoDB Connect error", error);
        } else {
          console.log("Connect to MongoDB");
        }
      }
    );
  };
  connect();
  mongoose.connection.on("error", (error) => {
    console.log("MongoDB connect error", error);
  });
  mongoose.connection.on("disconnected", () => {
    console.log("MongoDB 연결이 끊겼습니다. 연결을 재시도합니다.");
    connect(); //연결재시도
  });
  //schema 폴더의 user.js, board.js 도 세팅해주기.
  require("./user");
  require("./board");
  require("./calendar");
};
