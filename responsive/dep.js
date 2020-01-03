//发布订阅
class Dep {
  constructor() {
    this.subs = []

  }
  addSub(sub) {
    this.subs.push(sub);
  }
  notify(newVal) {
    console.log(this.subs);
    this.subs.forEach(v => {
      v.update(newVal);
    })
  }
}

class Watcher {
  constructor(vm, exp,cb) {
    Dep.target = this;
    this.cb = cb;
    vm._data[exp];
    Dep.target = null


  }
  update(newVal) {
   
    console.log("更新了", newVal) //改变视图
    this.cb(newVal)
  }
}