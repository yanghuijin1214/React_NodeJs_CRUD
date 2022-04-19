import React, { Component } from "react";
import { Navbar, Button } from "react-bootstrap";

import { NavLink } from "react-router-dom";
import axios from "axios";
axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

class Header extends Component {
  state = {
    buttonDisplay: "none",
  };
  componentDidMount() {
    //컴포넌트가 처음 render 되기 이전에 실행됨
    if (window.sessionStorage.getItem("login_id")) {
      //로그인 상태이면? 버튼 보이게
      this.setState({ buttonDisplay: "block" });
    } else {
      //로그아웃상태면 버튼 보이지 X
      this.setState({ buttonDisplay: "none" });
    }
  }

  logout = () => {
    axios
      .get("http://localhost:8080/member/logout", {
        headers,
      })
      .then((returnData) => {
        if (returnData.data.message) {
          window.sessionStorage.removeItem("login_id");
          window.sessionStorage.removeItem("login_email");
          window.sessionStorage.removeItem("login_name");

          alert("로그아웃 되었습니다!");
          window.location.href = "/"; //메인페이지로 redirect
        }
      });
  };

  render() {
    const buttonStyle = {
      margin: "0px 5px 0px 10px",
      display: this.state.buttonDisplay,
    };
    return (
      <div>
        <Navbar bg="primary" variant="dark">
          {/*navbar.brand 는 a 같은 링크인듯*/}
          <Navbar.Brand href="/">
            {window.sessionStorage.getItem("login_name")
              ? window.sessionStorage.getItem("login_name") + "'s"
              : null}{" "}
            Board
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <NavLink to="/mypage">
              <Button style={buttonStyle} variant="primary">
                회원정보 수정
              </Button>
            </NavLink>
            <NavLink to="/">
              <Button style={buttonStyle} variant="primary">
                글목록
              </Button>
            </NavLink>
            <NavLink to="/boardWrite">
              <Button style={buttonStyle} variant="primary">
                글쓰기
              </Button>
            </NavLink>
            <NavLink to="/calendar">
              <Button style={buttonStyle} variant="primary">
                달력
              </Button>
            </NavLink>
            <Button style={buttonStyle} onClick={this.logout} variant="primary">
              로그아웃
            </Button>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}
export default Header;
