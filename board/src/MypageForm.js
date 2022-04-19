import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

class MypageForm extends Component {
  constructor() {
    super();
    this.state = {
      resetPass: true,
    };
  }

  resetPassword = () => {
    this.setState((prevState) => ({ resetPass: !prevState.resetPass }));
  };

  delete = () => {
    if (window.confirm("정말로 탈퇴하시겠습니까?")) {
      axios
        .post("http://localhost:8080/member/delete", {
          headers,
          _id: window.sessionStorage.getItem("login_id"),
        })
        .then((returnData) => {
          if (returnData.data.message) {
            window.sessionStorage.removeItem("login_id");
            window.sessionStorage.removeItem("login_email");
            window.sessionStorage.removeItem("login_name");

            alert("탈퇴처리 되었습니다..");
            window.location.href = "/"; //메인페이지로 redirect
          }
        });
    }
  };

  update = () => {
    //현재 비밀번호 일치하는지
    const name = this.name.value;

    const cur_pw = this.cur_pw.value;
    const new_pw = this.new_pw.value;
    const new_pw_Check = this.new_pw_Check.value;

    if (name === "" || name === undefined) {
      alert("바꿀 이름을 입력해주세요.");
      this.name.focus();
      return;
    } else if (cur_pw === "" || cur_pw === undefined) {
      alert("현재 비밀번호를 입력해주세요.");
      this.cur_pw.focus();
      return;
    }

    //new_pw없으면 name만 수정
    if (new_pw === "" || new_pw === undefined) {
      const send_param = {
        name: name,
        _id: window.sessionStorage.getItem("login_id"),
        password: cur_pw,
      };
      axios
        .post("http://localhost:8080/member/update", send_param)
        .then((returnData) => {
          if (returnData.data.message) {
            window.sessionStorage.setItem("login_name", name);
            this.name = "";
            this.cur_pw = "";
            this.new_pw = "";
            this.new_pw_Check = "";
            alert("회원정보 수정 완료했습니다.");
            window.location.href = "/";
          } else {
            alert("회원정보 수정 실패! 현재 비밀번호를 확인해주세요.");
          }
        });
    }

    //바꿀비밀번호, 확인 일치하는지
    else {
      if (new_pw !== new_pw_Check) {
        alert("바꿀 비밀번호를 다시 확인해주세요.");
        this.new_pw.focus();
        return;
      }
      //바꿀 비밀번호 체크 일치
      else {
        const send_param = {
          name: name,
          _id: window.sessionStorage.getItem("login_id"),
          new_pw: new_pw,
          password: cur_pw,
        };
        axios
          .post("http://localhost:8080/member/update", send_param)
          .then((returnData) => {
            if (returnData.data.message) {
              this.name = "";
              this.cur_pw = "";
              this.new_pw = "";
              this.new_pw_Check = "";
              alert("회원정보 수정 완료했습니다.");
              window.location.href = "/";
            } else {
              alert("회원정보 수정 실패! 다시 시도해주세요.");
            }
          });
      }
    }
  };
  render() {
    const divStyle = {
      margin: 50,
    };
    const marginBottom = {
      marginBottom: 5,
    };
    return (
      <>
        <div style={divStyle}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>email</Form.Label>
            <Form.Control
              type="email"
              disabled
              value={window.sessionStorage.getItem("login_email")}
            />
            <Form.Label>name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              defaultValue={window.sessionStorage.getItem("login_name")}
              ref={(ref) => (this.name = ref)}
            />
            <Form.Label>password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              ref={(ref) => (this.cur_pw = ref)}
            />

            <Button
              style={{ marginTop: "20px" }}
              variant={this.state.resetPass === true ? "primary" : "success"}
              onClick={this.resetPassword}
            >
              비밀번호 수정
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-arrow-down-short"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"
                />
              </svg>
            </Button>
            <Form.Text className="text-muted">
              비밀번호를 수정하시려면 누르세요.
            </Form.Text>
            <div
              style={{
                display: `${this.state.resetPass === true ? "none" : "block"}`,
              }}
            >
              <Form.Label>new password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter New Password"
                ref={(ref) => (this.new_pw = ref)}
              />
              <Form.Label>new password check</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter New Password Check"
                ref={(ref) => (this.new_pw_Check = ref)}
              />
            </div>
          </Form.Group>
          <Button
            variant="primary"
            block
            style={marginBottom}
            onClick={this.update}
          >
            회원정보 수정
          </Button>
          <Button variant="primary" onClick={this.delete} block>
            회원 탈퇴
          </Button>
        </div>
      </>
    );
  }
}

export default MypageForm;
