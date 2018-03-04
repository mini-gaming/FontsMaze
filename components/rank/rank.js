// components/rank/rank.js

// 难度表
const levelTable =  {
  1: "普通",
  2: "复杂"
};

// 3 * 3结果显示内容表
const levelOneResultTable = {
  1: { 
    title: "最强大脑",
    discribe: "你和脑王只差一个爸爸",
    pic: "./../../resource/image/1.jpeg"
  },
  2: {
    title: "天生高手",
    discribe: "你正在和这个世界炫技",
    pic: "./../../resource/image/2.jpeg"
  },
  3: {
    title: "有颜有才",
    discribe: "颜值和才华平衡的刚刚好",
    pic: "./../../resource/image/3.jpeg"
  },
  4: {
    title: "聪明伶俐",
    discribe: "你很聪明，只是需要多点时间",
    pic: "./../../resource/image/4.jpeg"
  },
  5: {
    title: "重头再来",
    discribe: "你和完成体还差一顶帽子",
    pic: "./../../resource/image/5.jpeg"
  },
};

// 4 * 4结果显示内容表
const levelTwoResultTable = {
  1: {
    title: "最强大脑",
    discribe: "中国的最强大脑，请为自己骄傲",
    pic: "./../../resource/image/6.jpg"
  },
  2: {
    title: "天生高手",
    discribe: "请你用智商除暴安良",
    pic: "./../../resource/image/7.jpg"
  },
  3: {
    title: "有颜有才",
    discribe: "有才更有颜",
    pic: "./../../resource/image/8.jpg"
  },
  4: {
    title: "耐力惊人",
    discribe: "你看到这一条证明你绝不轻言放弃",
    pic: "./../../resource/image/9.jpg"
  },
  5: {
    title: "不卑不亢",
    discribe: "能看到这张图片的人都值得尊敬",
    pic: "./../../resource/image/10.jpg"
  },
};


Component({
  /**
   * 组件的属性列表
   */
  properties: {
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: false,
    time: "",
    level: "",
    title: "",
    discribe: "",
    pic: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //隐藏弹框
    hideRanking() {
      this.setData({
        isShow: !this.data.isShow
      })
    },
    //展示弹框
    showRanking(completeTime, isComplete, level) {
      this.setData({
        isShow: !this.data.isShow
      });
    },

    showResult(completeTime, isComplete, level) {
      this.setResult(completeTime, isComplete, level);
      this.showRanking();
    },
  
    setResult(completeTime, isComplete, level) {

      let time = `${parseInt(completeTime / 60)}分${completeTime % 60}秒`;

      let content = (level === 1 ? 
        levelOneResultTable[this.getTimeLevel(completeTime, level)] : 
        levelTwoResultTable[this.getTimeLevel(completeTime, level)]
      );

      this.setData({
        level: levelTable[level],
        title: content.title,
        discribe: content.discribe,
        pic: content.pic,
        time: time
      });
    },

    getTimeLevel(time, level) {
      let timeLevel = 5;

      if(level === 1) {
        if (time <= 60) {
          timeLevel = 1;
        } else if (time > 60 && time <= 180) {
          timeLevel = 2;
        } else if (time > 180 && time <= 300) {
          timeLevel = 3;
        } else if (time > 300 && time <= 420) {
          timeLevel = 4;
        } else if (time > 420) {
          timeLevel = 5;
        }
      } else if(level === 2) {
        if (time <= 500) {
          timeLevel = 1;
        } else if (time > 500 && time <= 750) {
          timeLevel = 2;
        } else if (time > 750 && time <= 1000) {
          timeLevel = 3;
        } else if (time > 1000 && time <= 1250) {
          timeLevel = 4;
        } else if (time > 1250) {
          timeLevel = 5;
        }
      }
      return timeLevel;
    },

    setResultData(completeTime, isComplete, level) {
      this.setData({
        completeTime: completeTime,
        isComplete: isComplete,
        level: level
      });
    }
  }
})
