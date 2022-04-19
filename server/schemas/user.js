const mongoose = require("mongoose");

//moongose 안의 schema 가져옴. 비구조할당.
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  loginCnt: {
    type: Number,
    default: 0,
  },
  lockYn: {
    type: Boolean,
    default: false,
  },
});

//변수를 모델 설정해서 외부로 내보내준다.
//index.js에서 모델을 읽어와 구성할 수 있음.
module.exports = mongoose.model("User", userSchema);
