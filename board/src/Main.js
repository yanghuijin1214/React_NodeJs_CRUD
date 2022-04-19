import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

class Main extends Component {
  render() {
    //style을 const에 담음
    const MainStyle = {
      textAlign: "center",
      marginTop: "10%",
    };
    /*
    const buttonStyle = {
      marginTop: 40,
    };*/

    //부트스트랩 사용
    return (
      <div style={MainStyle}>
        <h1>Sign-in is required to use Board!</h1>
        <div className="mb-2" style={{ marginTop: 60 }}>
          <Link to="/login">
            <Button variant="primary" size="lg" style={{ marginRight: 15 }}>
              로그인
            </Button>
          </Link>
          <Link to="/sign">
            <Button variant="primary" size="lg">
              회원가입
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}

export default Main;
