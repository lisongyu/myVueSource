class Kvue {
  constructor(option) {
    this.$option = option;
    this._data = option.data;

    //数据响应化
    this.observe(this._data);
    new Compile(option.el, this);
    if (option.created) {
      option.created.call(this)
    }

  }
  observe(data) {
    if (!data || typeof data !== 'object') {
      return;
    }
    //遍历该对象
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key]);
      //代理data中的属性到vue实例上
      this.proxyData(key)
    })
  }

  proxyData(key) {
    Object.defineProperty(this, key, {
      get() {
        return this._data[key]
      },
      set(newVal) {
        this._data[key]=newVal
      }
    })
  }



  //数据响应化
  defineReactive(obj, key, val) {
    //解决数据的嵌套
    this.observe(val);
    var dep = new Dep();
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