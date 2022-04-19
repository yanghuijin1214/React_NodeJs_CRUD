import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";

class SignForm extends Component {
  componentWillMount() {
    //componentdidmount 되기 이전.
    //컴포넌트가 생성되는 과정에서 호출된다.
    //render 이전에 호출됨!
    if (window.sessionStorage.getItem("login_id")) {
      window.location.href = "/";
    }
  }

  //회원가입
  join = () => {
    const joinEmail = this.joinEmail.value;
    const joinName = this.joinName.value;
    const joinPw = this.joinPw.value;
    //이메일 정규식
    const regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    //비밀번호 정규식. 숫자와 문자, 특수문자 포함 8~16자리
    const regExp2 = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;

    //이메일 오류
    if (joinEmail === "" || joinEmail === undefined) {
      alert("이메일 주소를 입력해주세요.");
      this.joinEmail.focus();
      return;
    } else if (
      joinEmail.match(regExp) === null ||
      joinEmail.match(regExp) === undefined
    ) {
      //이메일 형식에 맞지 않음.
      alert("이메일 형식에 맞게 입력해주세요.");
      this.joinEmail.value = "";
      this.joinEmail.focus();
      return;
    } else if (joinName === "" || joinName === undefined) {
      alert("이름을 입력해주세요.");
      this.joinName.focus();
      return;
    } else if (joinPw === "" || joinPw === undefined) {
      alert("비밀번호를 입력해주세요.");
      this.joinPw.focus();
      return;
    } else if (
      joinPw.match(regExp2) === null ||
      joinPw.match(regExp2) === undefined
    ) {
      //비밀번호 형식 맞지 않으면
      alert("비밀번호를 숫자와 문자, 특수문자 포함 8~16자리로 입력해주세요.");
      this.joinPw.value = "";
      this.joinPw.focus();
      return;
    }

    //join 성공하면?
    //백엔드로 넘겨줄 값
    const send_param = {
      //headers,
      email: this.joinEmail.value,
      name: this.joinName.value,
      password: this.joinPw.value,
    };
    axios
      .post("http://localhost:8080/member/join", send_param)
      //nodejs로 회원가입 정보 넘겨준다.
      .then((returnData) => {
        if (returnData.data.message) {
          //return 메시지 띄워주기
          alert(returnData.data.message);
          //이메일 중복체크
          if (returnData.data.dupYn === "1") {
            //중복되었으면
            this.joinEmail.value = "";
            this.joinEmail.focus();
          } else {
            //회원가입 성공?
            this.joinEmail.value = "";
            this.joinName.value = "";
            this.joinPw.value = "";
            window.location.href = "/";
          }
        } else {
          alert("회원가입에 실패하였습니다.");
        }
      })
      //에러 체크
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    //headers가 뭘까
    //console.log(headers);

    //style을 const에 담음
    const formStyle = {
      margin: 50,
    };
    const buttonStyle = {
      marginTop: 10,
    };

    //부트스트랩 사용
    return (
      <>
        <h1 style={formStyle}>SignUp</h1>

        <Form style={formStyle}>
          <Form.Group controlClass="joinForm">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              maxLength="100"
              //dom에 id를 지어주는 것.
              //this.joinEmail을 통하여 이 dom에 접근 가능하다
              ref={(ref) => (this.joinEmail = ref)}
              placeholder="Enter email"
            />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>

            <Form.Label>name</Form.Label>
            <Form.Control
              type="text"
              maxLength="20"
              ref={(ref) => (this.joinName = ref)}
              placeholder="name"
            />
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              maxLength="64"
              ref={(ref) => (this.joinPw = ref)}
              placeholder="Password"
            />
            <Button
              style={buttonStyle}
              onClick={this.join}
              //색깔
              variant="primary"
              type="button"
              //block하면 한 block 크기 다 차지하도록 커짐
              block
            >
              회원가입
            </Button>
          </Form.Group>
        </Form>
      </>
    );
  }
}

export default SignForm;
