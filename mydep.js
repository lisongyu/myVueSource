//发布订阅模式
class Dep{
  constructor() {
    //定义数组
    this.subs=[]
  }
  addSub(sub) {
    this.subs.push(sub)
  }
  //通知触发
  notify(newVal) {
    //对subs中的进行触发 watcher
    this.subs.forEach(v => {
      v.update(newVal)
    })
    
  }
}

//Watcher

class Watcher{
  constructor(vm,exp,cb) {
    Dep.target = this;
    //自身进行调用
    vm._data[exp];
    this.cb=cb

    Dep.target=null

  }
  update(newVal) {
    console.log('数据更新了');
    this.cb(newVal)
  }
}