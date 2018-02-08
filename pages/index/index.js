//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    completed: 4,
    score: 200,
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
    time: "00:41"
  },
  //事件处理函数
  selectWord: function(e) {
    let targetNode = e.target,
      targetIndex = targetNode.id;
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
  },
  onLoad: function () {
    
  },
})
