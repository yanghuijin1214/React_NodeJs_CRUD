const express = require("express");
const router = express.Router();
const crypto = require("crypto");

//model 불러오기
const User = require("../schemas/user");

//회원가입
router.post("/join", async (req, res) => {
  try {
    //email 일치하는 user 찾기
    let user = await User.findOne({ email: req.body.email });

    //user 출력
    console.log(user);

    //email 동일한 user이 있는지 체크
    if (user) {
      res.json({
        messsage: "이메일이 중복되었습니다. 새로운 이메일을 입력해주세요.",
        dupYn: "1", //중복인지 나타내기 위한 data
      });
    }
    //user 없으면 회원가입시킨다.
    else {
      //user 에 회원추가

      //암호화 키를 랜덤으로 생성해줌(길이 64)
      crypto.randomBytes(64, (err, buf) => {
        if (err) {
          //에러감지
          console.log(err);
        } else {
          crypto.pbkdf2(
            req.body.password,
            buf.toString("base64"),
            10000,
            64,
            "sha512",
            async (err, key) => {
              if (err) {
                console.log(err);
              } else {
                //바이너리를 base64로 인코딩
                //buf.toString("base64");
                obj = {
                  email: req.body.email,
                  name: req.body.name,
                  password: key.toString("base64"),
                  salt: buf.toString("base64"), //salt도 저장
                };
                //new user 저장!
                user = new User(obj);
                await user.save();
                res.json({ message: "회원가입 되었습니다!", dupYn: "0" });
              }
            }
          );
        }
      });
    }
  } catch (err) {
    res.json({ messsage: false });
  }
});

//로그인
router.post("/login", async (req, res) => {
  try {
    //이메일 값으로 아이디가 존재하는지 확인
    await User.findOne({ email: req.body.email }, async (err, user) => {
      //request (react에서 send_param)으로 email 이 넘어옴
      if (err) {
        console.log(err);
      } else {
        //로그인 처리
        console.log(user);

        if (user) {
          //이메일 일치하는 아이디가 존재하면 패스워드도 확인하기

          //req로 넘어온 pw 암호화
          crypto.pbkdf2(
            req.body.password,
            user.salt,
            10000,
            64,
            "sha512",
            async (err, key) => {
              if (err) {
                console.log(err);
              } else {
                //print
                console.log(key.toString("base64"));

                //object에 담기
                const obj = {
                  email: req.body.email,
                  password: key.toString("base64"),
                };

                //user에서 일치하는 data있는지 읽어오기

                if (user.password === obj.password) {
                  console.log(user);
                  //user 있으면 로그인!
                  await User.updateOne(
                    {
                      email: req.body.email,
                    },
                    { $set: { loginCnt: 0 } }
                  ); //login 횟수 0으로 set해준다.

                  //request session 에 email 추가
                  req.session.email = user.email;
                  //_id는 컬럼값이 아니고 data를 구분하기위한 고유한값임
                  res.json({
                    message: user.name + "님 반갑습니다.",
                    login_success: true,
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                  });
                } else {
                  //비밀번호가 틀리면 실패횟수 추가
                  if (user.loginCnt > 4) {
                    res.json({
                      message:
                        "비밀번호가 5회 이상 일치하지 않아 잠겼습니다. \n 고객센터에 문의 바랍니다.",
                      login_success: false,
                    });
                  } else {
                    await User.updateOne(
                      {
                        email: req.body.email,
                      },
                      { $set: { loginCnt: user.loginCnt + 1 } }
                    );

                    if (user.loginCnt >= 5) {
                      await User.updateOne(
                        {
                          email: req.body.email,
                        },
                        { $set: { lockYn: true } }
                      );
                      res.json({
                        message:
                          "비밀번호가 5회 이상 일치하지 않아 잠겼습니다. \n 고객센터에 문의 바랍니다.",
                        login_succces: false,
                      });
                    } else {
                      res.json({
                        message: "아이디나 비밀번호가 일치하지 않습니다.",
                        login_success: false,
                      });
                    }
                  }
                }
              }
            }
          );
        } //if(user)
        else {
          res.json({
            message: "존재하지 않는 아이디입니다. 회원가입을 해주세요.",
            login_success: false,
          });
        }
      }
    });
  } catch (err) {
    console.log(err);
    res.json({ message: "로그인 실패", login_success: false });
  }
});

//로그아웃
router.get("/logout", (req, res) => {
  console.log("/logout" + req.sessionID);
  req.session.destroy(() => {
    res.json({ message: true });
  });
});

//delete
router.post("/delete", async (req, res) => {
  try {
    await User.remove({
      _id: req.body._id,
    });
    res.json({ message: true });
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

//update
router.post("/update", async (req, res) => {
  try {
    await User.findOne({ _id: req.body._id }, async (err, user) => {
      if (err) {
        console.log(err);
        res.json({ message: false });
      } else {
        if (user) {
          crypto.pbkdf2(
            req.body.password,
            user.salt,
            10000,
            64,
            "sha512",
            async (err, key) => {
              if (err) {
                console.log(err);
                res.json({ message: false });
              } else {
                //object에 담기
                const pw = key.toString("base64");

                //user의 password가 일치하면

                if (user.password === pw) {
                  // 비밀번호 일치

                  //비밀번호는 수정안할 때
                  if (req.body.new_pw === undefined) {
                    try {
                      await User.updateOne(
                        { _id: req.body._id },
                        {
                          $set: {
                            name: req.body.name,
                          },
                        }
                      );
                      res.json({ message: true });
                    } catch (err) {
                      console.log(err);
                      res.json({ message: false });
                    }
                  } //if
                  //비밀번호 수정할 때
                  else {
                    //새 비밀번호 암호화 진행..
                    try {
                      crypto.pbkdf2(
                        req.body.new_pw,
                        user.salt,
                        10000,
                        64,
                        "sha512",
                        async (err, key) => {
                          if (err) {
                            console.log(err);
                            return false;
                          } else {
                            await User.updateOne(
                              { _id: req.body._id },
                              {
                                $set: {
                                  name: req.body.name,
                                  password: key.toString("base64"),
                                  //password:pw
                                },
                              }
                            );
                            res.json({ message: true });
                          }
                        }
                      );
                    } catch (err) {
                      console.log(err);
                      res.json({ message: false });
                    }
                  }
                } else {
                  //비밀번호가 틀리면 업데이트 실패
                  res.json({ message: false });
                }
              }
            }
          );
        } else {
          res.json({ message: false });
        }
      }
    });
  } catch (err) {
    res.json({ message: false });
  }
});

module.exports = router;
