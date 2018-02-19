//index.js
//获取应用实例
const app = getApp()

Page({
  data: {

    // 模拟服务器数据
    mock: {
      "success": true,
      "data": {
        "idioms": [
          {
            "question": "天下为公",
            "picture": "../../resource/img/word.jpg",
            "options": [
              "走",
              "我",
              "天",
              "你",
              "为",
              "大",
              "升",
              "它",
              "公",
              "宋",
              "力",
              "上",
              "下",
              "垃"
            ],
            "answer": [
              2,
              4,
              8,
              12
            ]
          },
          {
            "question": "天下为公",
            "picture": "../../resource/img/word.jpg",
            "options": [
              "天",
              "我",
              "走",
              "你",
              "为",
              "大",
              "升",
              "公",
              "它",
              "宋",
              "力",
              "上",
              "垃",
              "下"
            ],
            "answer": [
              0,
              4,
              7,
              13
            ]
          }
        ]
      }
    },
    idioms: [],
    isShow: false,
    gameStarting: false,
    words: [
      {
        content: "齐",
        select: 0
      }, 
      {
        content: "体",
        select: 0
      }, 
      {
        content: "立",
        select: 0
      }, 
      {
        content: "水",
        select: 0
      }, 
      {
        content: "层",
        select: 0
      }, 
      {
        content: "迷",
        select: 0
      }, 
      {
        content: "消",
        select: 0
      }, 
      {
        content: "天",
        select: 0
      }, 
      {
        content: "圣",
        select: 0
      }, 
      {
        content: "大",
        select: 0
      }, 
      {
        content: "果",
        select: 0
      }, 
      {
        content: "完",
        select: 0
      }, 
      {
        content: "蛋",
        select: 0
      }, 
      {
        content: "了",
        select: 0
      }
    ],
    selectArr: [],

    answer: ["0", "7", "9", "8"],
    pic: "",
    level: 0,


    // 游戏相关状态
    gameStatus: {
      starting: false,
      time: 60000,
      showTime: "01:00",
    },
    // 当前结果记录
    result: {
      // 已完成
      completed: 0,
      // 分数
      score: 0
    }
  },

  // 从服务器上获取数据
  getGameData: function() {
    wx.request({
      url: "../../resource/data/data.json",
      method: "GET",
      data: {
        idiomIndexArr: [0, 8, 11, 3, 99, 12]
      },
      dataType: "json",
      success: function(res) {
        console.log(res.data)
      }
    })
  },

  // 游戏开始
  gameStart: function() {
    // 初始化游戏初始数据
    // 初始化游戏第一关数据
    // 游戏倒计时开始
    // 延迟两秒的定时器之后换成向数据库请求数据
    // 服务器上拉取数据
    wx.showLoading({
      title: '游戏初始化',
    })
    setTimeout(() => {
      // 游戏数据初始化
      this.initGameData(this.data.mock);
      this.setData({
        gameStarting: true
      })
      this.createQuestion("../../resource/img/word.jpg");
      wx.hideLoading();
      this.setData({
        isShow: true
      })
      this.startTimer();
    }, 1000);
  },

  // 游戏数据初始化
  initGameData: function(data) {
    this.setData({
      idioms: data.data.idioms
    });
    let level = this.data.level;
    let levelData = this.data.idioms[level];
    let options = [];
    
    levelData.options.forEach(v => {
      options.push({
        content: v,
        select: 0
      })
    });
    this.setData({
      level: level + 1,
      answer: levelData.answer,
      pic: levelData.pic,
      words: options
    });
  },

  // 游戏结束
  gameEnd: function() {
    let gameStatus = {
      starting: false,
      level: 0,
      time: 60000,
      showTime: "01:00",
      answers: [],
      options: []
    };
    let result = {
      // 已完成
      completed: 0,
      // 分数
      score: 0
    };
    this.setData({
      gameStatus: gameStatus,
      result: result
    });
  },

  // 1分钟计时开始
  startTimer: function () {
    let self = this;
    let startTime = Date.now();
    let gameTime = this.data.gameStatus.time;
    let timer = setInterval(() => {
      let time = Date.now() - startTime;
      self.upTimer(time);
      if (time >= gameTime) {
        clearInterval(timer);
        self.gameEnd();
      }
    }, 1000);
  },

  // 更新计时显示时间
  upTimer: function(time) {
    let gameStatus = this.data.gameStatus;
    let passTime = parseInt(time / 1000);
    let totalTime = gameStatus.time / 1000;
    if (passTime <= totalTime) {
      let m = parseInt((totalTime - passTime) / 60);
      let s = (totalTime - passTime) % 60;
      let minute = m >= 10 ? m : "0" + m;
      let second = s >= 10 ? s : "0" + s;
      gameStatus.showTime = `${minute}:${second}`;
      this.setData({
        gameStatus: gameStatus
      });
    }
  },

  // 选择四字答案动作
  selectWord: function(e) {
    let targetNode = e.target,
      targetIndex = parseInt(targetNode.id);
    let select = this.data.words[targetIndex].select == 0 ? 1 : 0;

    let tempSelectArr = this.data.selectArr;
    let tempArr = this.data.words;

    if (select == 0) {
      let index = tempSelectArr.indexOf(targetIndex);
      if (index!= -1) {
        tempSelectArr.splice(index, 1);
      }
      tempArr[targetIndex].select = select;
      this.setData({
        words: tempArr,
        selectArr: tempSelectArr
      });
    }
    if (select == 1 && this.data.selectArr.length < 4) {
      tempSelectArr.push(targetIndex);
      tempArr[targetIndex].select = select;
      this.setData({
        words: tempArr,
        selectArr: tempSelectArr
      });
    }

    // 当选择了四个字时，判断是否正确
    if(this.data.selectArr.length === 4) {
      if(this.isCorrect(this.data.selectArr, this.data.answer)) {
        let result = this.data.result;
        result.completed = result.completed + 1;
        result.score = result.score + 100;
        this.setData({
          result: result
        });
        // 游戏第二关初始化
        this.nextLevel();
      }
    }
  },

  // 下一关初始化
  nextLevel: function() {
    let level = this.data.level;
    if(level == 2) {
      level = 0;
    }
    let words = this.data.words;
    let levelData = this.data.idioms[level];
    let options = [];
    levelData.options.forEach(v => {
      options.push({
        content: v,
        select: 0
      })
    });
    words.forEach(v => {
      v.select = 0;
    })

    this.setData({
      gameStarting: false,
      pic: levelData.picture,
    });

    this.createQuestion(levelData.picture);

    setTimeout(() =>  {
      this.setData({
        selectArr: [],
        level: level + 1,
        answer: levelData.answer,
        words: options,
        gameStarting: true
      });
    }, 1000);
    
  },

  // 将汉字图片拆分两部分，生成题目
  createQuestion: function (imgSrc) {
    var context1 = wx.createCanvasContext("myCanvas1");
    var context2 = wx.createCanvasContext("myCanvas2");

    const X = 120; // 720
    const Y = 30; // 180
    const size = 6;

    let tempX = [];
    let tempY = [];

    for (let i = 0; i < X; i++) {
      tempX.push(i);
    }

    for (let i = 0; i < Y; i++) {
      tempY.push(i);
    }

    var arrX = [];
    var arrY = [];

    for (let i = 0; i < X*0.65; i++) {
      let index = parseInt(Math.random() * (tempX.length - 1));
      arrX.push(tempX.splice(index, 1)[0]);
    }

    for (let j = 0; j < Y * 0.65; j++) {
      let index = parseInt(Math.random() * (tempY.length - 1));
      arrY.push(tempY.splice(index, 1)[0]);
    }
    arrX.sort((a, b) => a - b);
    arrY.sort((a, b) => a - b);

    for (let i = 0; i < X; i++) {
      for (let j = 0; j < Y; j++) {
        if (arrX.indexOf(i)>=0 && arrY.indexOf(j)>=0) {
          context1.drawImage(imgSrc, i * size, j * size, size, size, i * size * 1.25, j * size * 1.25, size * 1.25, size * 1.25)

        } else {
          context2.drawImage(imgSrc, i * size, j * size, size, size, i * size * 1.25, j * size * 1.25, size * 1.25, size * 1.25);
        }
      }
    }
    context1.draw();
    context2.draw();
  },

  // 判断答案是否正确
  isCorrect: function(arr, answer) {
    if (!Array.isArray(arr) || arr.length != 4 || !Array.isArray(answer) || answer.length != 4 ) {
      return false;
    }
    let result = true;
    for(let i=0; i<4; i++) {
      if(answer.indexOf(arr[i]) < 0) {
        result = false;
        break;
      }
    }
    return result;
  },

  onLoad: function () {
    
  },

  onReady: function() {
    
  }
})
