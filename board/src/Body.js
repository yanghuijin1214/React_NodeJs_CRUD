import React, { Component } from "react";
import LoginForm from "./LoginForm";
import SignForm from "./SignForm";
import BoardForm from "./BoardForm";
import BoardWriteForm from "./BoardWriteForm";
import BoardDetail from "./BoardDetail";
import Main from "./Main";
import MypageForm from "./MypageForm";
import CalendarForm from "./CalendarForm";
import { Route } from "react-router-dom";

class Body extends Component {
  render() {
    let resultForm;

    function getResultForm() {
      //sessionStorage에 login_id 확인
      //console.log(window.sessionStorage.getItem("login_id"));
      if (window.sessionStorage.getItem("login_id")) {
        resultForm = <Route exact path="/" component={BoardForm}></Route>;
        return resultForm;
      } else {
        resultForm = <Route exact path="/" component={Main}></Route>;
        return resultForm;
      }
    }

    getResultForm(); //resultForm 호출
    return (
      <div>
        <Route path="/login" component={LoginForm}></Route>
        <Route path="/sign" component={SignForm}></Route>
        <Route path="/mypage" component={MypageForm}></Route>
        <Route path="/boardWrite" component={BoardWriteForm}></Route>
        <Route path="/board/detail" component={BoardDetail}></Route>
        <Route path="/calendar" component={CalendarForm}></Route>
        {resultForm}
      </div>
    );
  }
}

export default Body;
