const express = require("express");

const Calendar = require("../schemas/calendar");

//router 설정
const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    let obj;

    obj = {
      writer: req.body.writer,
      id: req.body.id,
      title: req.body.title,
      start: req.body.start,
      end: req.body.end,
      allDay: req.body.allDay,
    };

    const calendar = new Calendar(obj);
    await calendar.save(); //db에 저장
    res.json({ message: true });
  } catch (err) {
    res.json({ message: false });
  }
});

router.post("/getcal", async (req, res) => {
  try {
    const _id = req.body._id;
    const calendar = await Calendar.find({ writer: _id });
    res.json({ message: true, calendar });
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

router.post("/delete", async (req, res) => {
  try {
    await Calendar.remove({
      _id: req.body._id,
    });
    res.json({ message: true });
  } catch (err) {
    res.json({ message: false });
  }
});

router.post("/update", async (req, res) => {
  try {
    await Calendar.updateOne(
      {
        _id: req.body._id,
      },
      {
        $set: {
          start: req.body.start,
          end: req.body.end,
        },
      }
    );
    res.json({ message: true });
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

module.exports = router;
