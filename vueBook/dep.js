//发布订阅模式
let uid = 0
class Dep {
  constructor() {
    this.id = uid++
    //定义数组
    this.subs = []
  }
  addSub(sub) {
    this.subs.push(sub)
  }
  depend() {
    if (Dep.target) {
      //this.addSub(Dep.target)
      Dep.target.addDep(this)
    }
  }
  removeSub(sub) {
    const index = this.subs.indexOf(sub);
    if (index > -1) {
      return this.subs.splice(index, 1)
    }
  }
  //通知触发
  notify() {
    //对subs中的进行触发 watcher

    console.log(this.subs)
    this.subs.forEach(v => {
      v.update()
    })

  }
}
class Watcher {
  //expOrFn 为key属性值 还可为函数
  constructor(vm, expOrFn, cb, options) {
    //将当前watcher实例制定到Dep静态属性target
    this.cb = cb;
    this.vm = vm;

    //新增
    if (options) {
      this.deep = !!options.deep
    } else {
      this.deep = false
    }
    this.deps = [];
    this.depIds = new Set()
    //expOrFn 参数支持函数
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
    }
    this.value = this.get();
  }
  addDep(dep) {
    const id = dep.id
    if (!this.depIds.has(id)) {
      this.depIds.add(id)
      this.deps.push(dep)
      dep.addSub(this)
    }
  }
  get() {

    Dep.target = this;

    let value = this.getter.call(this.vm, this.vm);
    if (this.deep) {
      traverse(value)
    }

    Dep.target = null;
    return value
  }
  update() {
    console.log('属性更新了');
    const oldValue = this.value;

    //设置后的调用获取调用后的值
    this.value = this.get();
   
  
    this.cb.call(this.vm, this.value, oldValue)
  }
  teardown() {

    let i = this.deps.length
    while (i--) {
      this.deps[i].removeSub(this)
    }

  }
}