//index.js
const service = require('../../service/service.js')
//获取应用实例
const app = getApp()

Page({
  data: {
    animationData: {},
    idioms: [],
    gameState: 0,
    selectArr: [],
    pic: "",
    level: 0,
    startWords: ["请", "点", "击", "右", "下", "角", "蓝", "色", "按", "钮", "开", "始", "游","戏"],

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
  // 游戏开始
  gameStart: function() {
    wx.showLoading({
      title: '游戏初始化',
    });
    let self = this;
    let data = {
      idiomIndexArr: self.random(6, 0, 101)
    };
    // 服务器上拉取数据
    service.post(data, '/game/idiom', function (ret) {
      if(ret.statusCode === 200) {
        // 游戏数据初始化
        self.initGameData(ret.data);
        self.setData({
          gameState: 1
        });
        self.createQuestion(self.data.idioms[self.data.level].picture);
        wx.hideLoading();
        self.startTimer();
      }
    });
  },

  // 随机生成数组
  random: function(len, start, end) {
    var arr = [];
    function _inner(start, end) {
      var span = end - start;
      return parseInt(Math.random() * span + start)
    }
    while (arr.length < 4) {
      var num = _inner(start, end);
      if (arr.indexOf(num) == -1) {
        arr.push(num);
      }
    }
    return arr;
　},

  // 随机生产答案
  answerInit: function(idioms) {
    if(Array.isArray(idioms) && idioms.length != 0) {
      idioms.forEach(v => {
        v.picture = `https://www.zqdnstanley.cn/static/img/${v.question}.jpg`;
        let answer = this.random(4, 0, 14);
        let questionArr = v.question.split('');

        let options = Array(14);

        let a = 0;
        answer.forEach(v => {
          options[v] = questionArr[a++];
        });

        let b = 0;
        for(let i=0; i<14; i++) {
          if(options[i]) {
            continue;
          }
          options[i] = v.options[b++];
        }
        v.options = options;
        v.answer = answer;
      });
    }
    return idioms;
  },

  // 游戏数据初始化
  initGameData: function(res) {

    let idioms = res.data.idioms;

    // 随机生成答案
    this.answerInit(idioms);

    this.setData({
      idioms: idioms
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
      level: level,
      answer: levelData.answer,
      pic: levelData.picture,
      words: options
    });
  },

  // 游戏结束
  gameEnd: function() {
    this.showRanking();
    let gameStatus = {
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
      result: result,
      gameState: 0
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
          result: result,
          gameState: 2
        });
        // 游戏第二关初始化
        this.nextLevel();
      }
    }
  },

  // 下一关初始化
  nextLevel: function() {
    let level = this.data.level;
    let words = this.data.words;

    let idioms = [].concat(this.data.idioms);
    idioms.splice(level, 1);

    let pic = this.data.idioms[level].picture;
    let levelData = idioms[level];
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
      pic: pic
    });
    this.createQuestion(levelData.picture);
    setTimeout(() =>  {
      this.setData({
        selectArr: [],
        answer: levelData.answer,
        words: options,
        gameState: 1,
        idioms: idioms
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

  showRanking() {
    let score = this.data.result.score;
    let leaderboard = this.leaderboard;
    let gameInfo = {
      "gameId": 3,
      "userId": app.globalData.userInfo.userId,
      "score": score
    }
    leaderboard.display();
    service.post(gameInfo, '/game/score', function (ret) {
      console.log(ret)
      let personScore = ret.data.data;
      personScore.score = score;
      leaderboard.displayScore(personScore);
    })
    // let gameInfo = ;
    // this.ranking.showResult(gameInfo.time, gameInfo.isFinished, level);
  },

  //滑动开始事件
  handletouchtart: function (event) {
    this.data.lastX = event.touches[0].pageX;
    this.data.lastY = event.touches[0].pageY;
  },

  //滑动移动事件
  handletouchmove: function (event) {
    var currentX = event.touches[0].pageX
    var tx = currentX - this.data.lastX
    //左右方向滑动
    if (tx < -20) {
      this.data.currentGesture = 1;
    } else if (tx > 20) {
      this.data.currentGesture = 2;
    }
  },

  //滑动结束事件
  handletouchend: function (event) {
    if (this.data.currentGesture === 1) {
      this.jumpLevel(2);
    } else if (this.data.currentGesture === 2) {
      this.jumpLevel(1);
    } else {
      return;
    }
    this.data.currentGesture = 0
  },

  // 跳过关卡，option=1为上一关，2为下一关
  jumpLevel: function (option) {
    let level = this.data.level;
    let words = this.data.words;
    let pic = this.data.idioms[level].picture;
    let currentLevel;
    let length = this.data.idioms.length - 1;
    if(option === 1) {
      if(level === 0) {
        currentLevel = length;
      } else {
        currentLevel = level - 1;
      }
    } else if(option === 2) {
      if (level === length) {
        currentLevel = 0;
      } else {
        currentLevel = level + 1;
      }
    } else {
      return;
    }
    let levelData = this.data.idioms[currentLevel];
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
    this.createQuestion(levelData.picture);
    this.setData({
      selectArr: [],
      level: currentLevel,
      answer: levelData.answer,
      words: options
    });
  },

  onLoad: function () {
    
  },

  onReady: function() {
    this.ranking = this.selectComponent("#ranking");
    this.leaderboard = this.selectComponent("#leaderboard");
  }
})
