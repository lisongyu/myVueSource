//发布订阅模式
class Dep {
  constructor() {
    //定义数组
    this.subs = []
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
class Watcher {
  constructor(vm, key, cb) {
    //将当前watcher实例制定到Dep静态属性target
    Dep.target = this;
    this.cb = cb;
    this.vm = vm;
    this.key = key;
    vm[key];
    Dep.target = null;

  }
  update() {
    console.log('属性更新了')
    this.cb.call(this.vm, this.vm[this.key])
  }
}