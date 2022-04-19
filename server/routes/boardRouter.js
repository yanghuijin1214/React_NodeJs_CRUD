const express = require("express");

//db model을 읽어온다.
const Board = require("../schemas/board");

//router 설정
const router = express.Router();

// board/delete url에 대한 일처리
router.post("/delete", async (req, res) => {
  try {
    await Board.remove({
      _id: req.body._id,
    });
    res.json({ message: true });
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

//get방식은 데이터를 url 뒤에 붙여서 보냄
//post방식은 body에 데이터를 넣어서 보냄!
//그래서 req.body 에서 데이터를 읽어옴
router.post("/update", async (req, res) => {
  try {
    await Board.update(
      { _id: req.body._id },
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
        },
      }
    );
    res.json({ message: "게시글이 수정 되었습니다." });
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

router.post("/write", async (req, res) => {
  try {
    let obj;

    obj = {
      writer: req.body._id,
      title: req.body.title,
      content: req.body.content,
    };

    const board = new Board(obj);
    await board.save();

    res.json({ message: "게시글이 업로드 되었습니다." });
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

//board list
router.post("/getBoardList", async (req, res) => {
  try {
    const _id = req.body._id;
    const board = await Board.find({ writer: _id }, null, {
      sort: { createdAt: -1 },
    });
    res.json({ list: board });
  } catch (err) {
    res.json({ message: false });
  }
});

router.post("/detail", async (req, res) => {
  try {
    const _id = req.body._id;
    const board = await Board.find({ _id });
    //res에 board 담아 보내기
    res.json({ board });
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

module.exports = router;
