import React, { Component } from "react";
import { Table, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";

import axios from "axios";
axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

class BoardDetail extends Component {
  state = {
    board: [],
  };

  componentDidMount() {
    //boardform에서 보낸 query를 읽을 때
    //console.log(this.props.location.query);
    if (this.props.location.query !== undefined) {
      this.getDetail();
    } else {
      window.location.href = "/";
    }
  }
  getDetail = () => {
    const send_param = {
      headers,
      _id: this.props.location.query._id,
    };

    const marginBottom = {
      marginBottom: 5,
    };
    axios
      .post("http://localhost:8080/board/detail", send_param)
      .then((returnData) => {
        if (returnData.data.board[0]) {
          let board = returnData.data.board[0];
          const board_html = (
            <div>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>{board.title}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      dangerouslySetInnerHTML={{
                        __html: board.content,
                      }}
                    ></td>
                  </tr>
                </tbody>
              </Table>
              <div className="mb-2">
                <NavLink
                  to={{
                    pathname: "/boardWrite",
                    query: {
                      title: board.title,
                      content: board.content,
                      _id: this.props.location.query._id,
                    },
                  }}
                >
                  <Button block style={marginBottom}>
                    글 수정
                  </Button>
                </NavLink>
                <Button
                  block
                  onClick={this.deleteBoard.bind(
                    null,
                    this.props.location.query._id
                  )}
                >
                  글 삭제
                </Button>
              </div>
            </div>
          );
          this.setState({
            board: board_html,
          });
        } else {
          alert("글 상세 조회 실패");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  deleteBoard = (_id) => {
    const send_param = {
      headers,
      _id,
    };
    if (window.confirm("정말 삭제하시겠습니까?")) {
      axios
        .post("http://localhost:8080/board/delete", send_param)
        .then((returnData) => {
          if (returnData.data.message) {
            alert("게시글이 삭제 되었습니다.");
            window.location.href = "/";
          } else {
            alert("글 삭제 실패!");
            return;
          }
        })
        .catch((err) => {
          console.log(err);
          alert("글 삭제 실패!");
        });
    }
  };
  render() {
    const divStyle = {
      margin: 50,
    };
    return <div style={divStyle}>{this.state.board}</div>;
  }
}

export default BoardDetail;
