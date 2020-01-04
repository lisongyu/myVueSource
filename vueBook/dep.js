//发布订阅模式
class Dep {
  constructor() {
    //定义数组
    this.subs = []
  }
  addSub(sub) {
    this.subs.push(sub)
  }
  depend() {
    if (Dep.target) {
      this.addSub(Dep.target) 
    }
  }
  //通知触发
  notify(newVal) {
    //对subs中的进行触发 watcher
    console.log(newVal)
    console.log(this.subs)
    this.subs.forEach(v => {
      v.update(newVal)
    })

  }
}
class Watcher {
  //expOrFn 为key属性值 还可为函数
  constructor(vm, expOrFn, cb) {
    //将当前watcher实例制定到Dep静态属性target
    Dep.target = this;
    this.cb = cb;
    this.vm = vm;
    //expOrFn 参数支持函数
    
    this.key = expOrFn;
    vm[key];
    Dep.target = null;

  }
  update() {
    console.log('属性更新了')
    this.cb.call(this.vm, this.vm[this.key])
  }
}