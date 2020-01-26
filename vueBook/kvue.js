// set();

class Kvue {
  constructor(option) {
    this.$option = option;
    this._data = option.data;

    //数据响应化
    // this.observe(this._data);
    this.proxyData(this._data);
    initEvents(this)

    new Observer(this._data, this);
    new Compile(option.el, this);

    this.$set = set;
    this.$del = del

    if (option.created) {
      option.created.call(this)
    }

  }
  $watch(expOrFn, cb, $options = {}) {
    const vm = this;

    //调用监听方法
    const watcher = new Watcher(vm, expOrFn, cb, $options);
    //如果为true
    //立刻执行
    if ($options.immediate) {
      cb.call(vm, watcher.value)
    }
    return function unwatchFn() {
      watcher.teardown()
    }

  }
  // $set(target, key, val) {

  //   return (function () {
  //     set(target, key, val)
  //  })()

  // }
  observe(data) {
    if (!data || typeof data !== 'object') {
      return;
    }
    //如果为数组
    if (Array.isArray(data)) {
      // window.dep = new Dep();
      const augment = hasProto ? this.protoAugment : this.copyAugment;
      augment(data, this.arrayMethods(), arrayKeys)
      // data.__proto__ = this.arrayMethods() //新增
    } else {
      //遍历该对象
      Object.keys(data).forEach(key => {
        this.defineReactive(data, key, data[key]);
        //代理data中的属性到vue实例上
        this.proxyData(key)
      })

    }

  }
  protoAugment(target, src, keys) {
    target.__proto__ = src
  }
  copyAugment(target, src, keys) {
    for (let i = 0, l = keys.length; i < l; i++) {
      const key = keys[i]
      def(target, key, src[key])
    }
  }
  //数组方法重写


  proxyData(data) {

    Object.keys(data).forEach(key => {


      Object.defineProperty(this, key, {
        get() {

          return data[key]
        },
        set(newVal) {
          data[key] = newVal
        }
      })






    })




  }



  //数据响应化
  defineReactive(obj, key, val) {
    //解决数据的嵌套

    this.observe(val);
    window.dep = new Dep();
    Object.defineProperty(obj, key, {
      get() {
        if (Dep.target) {
          dep.addSub(Dep.target)
        }
        return val
      },
      set(newVal) {
        if (val === newVal) {
          return
        }
        val = newVal;
        dep.notify(newVal)
        console.log(`${key}属性更新了:${val}`)

      }
    })
  }
}

renderMinix(Kvue);
eventsMixin(Kvue)