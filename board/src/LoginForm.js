import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import { loadReCaptcha, ReCaptcha } from "react-recaptcha-v3";
import axios from "axios";

class LoginForm extends Component {
  //reCAPTCHA 는  로봇이 아닙니다 검사인듯
  componentDidMount() {
    loadReCaptcha("6LfGieAUAAAAAJSOoqXS5VQdT_e5AH8u0n2e1PDb");
  }

  componentWillMount() {
    //componentdidmount 되기 이전.
    //컴포넌트가 생성되는 과정에서 호출된다.
    //render 이전에 호출됨!
    if (window.sessionStorage.getItem("login_id")) {
      window.location.href = "/";
    }
  }

  verifyCallback = (recaptchaToken) => {
    // Here you will get the final recaptchaToken!!!
    //console.log(recaptchaToken, "<= your recaptcha token");
  };

  //로그인
  login = () => {
    const loginEmail = this.loginEmail.value;
    const loginPw = this.loginPw.value;

    if (loginEmail === "" || loginEmail === undefined) {
      alert("이메일 주소를 입력해주세요.");
      this.loginEmail.focus();
      return;
    } else if (loginPw === "" || loginPw === undefined) {
      alert("비밀번호를 입력해주세요.");
      this.loginPw.focus();
      return;
    }

    const send_param = {
      //headers,
      email: this.loginEmail.value,
      password: this.loginPw.value,
    };
    axios
      .post("http://localhost:8080/member/login", send_param)
      //nodejs login에 파라미터 전송
      .then((returnData) => {
        if (returnData.data.login_success) {
          //session은 cookie 와 다르게 expire 지정 불가능
          window.sessionStorage.setItem("login_id", returnData.data._id);
          window.sessionStorage.setItem("login_email", returnData.data.email);
          window.sessionStorage.setItem("login_name", returnData.data.name);
          alert(returnData.data.message);
          //reload해주기
          window.location.reload();
        } else {
          alert(returnData.data.message);
        }
      }) //에러
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
        <h1 style={formStyle}>Login</h1>
        <Form style={formStyle}>
          {/*LoginForm */}
          <Form.Group controlClass="loginForm">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              maxLength="100"
              ref={(ref) => (this.loginEmail = ref)}
              placeholder="Enter email"
            />
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              maxLength="20"
              ref={(ref) => (this.loginPw = ref)}
              placeholder="Password"
            />
            <ReCaptcha
              sitekey="6LfGieAUAAAAAJSOoqXS5VQdT_e5AH8u0n2e1PDb"
              action="login"
              verifyCallback={this.verifyCallback}
            />
            <Button
              style={buttonStyle}
              onClick={this.login}
              variant="primary"
              type="button"
              block
            >
              로그인
            </Button>
          </Form.Group>
        </Form>
      </>
    );
  }
}

export default LoginForm;
