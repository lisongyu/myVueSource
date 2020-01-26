//数据响应原理
function defineReactive(obj, key, val) {
  //递归子属性
  let childOb = observe(val)
  let dep = new Dep();
  Object.defineProperty(obj, key, {
    get() {

      dep.depend();
      //添加收集

      if (childOb) {

        childOb.dep.depend()
      }
      return val
    },
    set(newVal) {

      if (val === newVal) {
        return
      }
      val = newVal;
      dep.notify();
      console.log(`${key}属性更新了:${val}`)

    }
  })
}
class Observer {
  constructor(value, vm) {

    this.value = value;

    this.dep = new Dep() //新增dep
    this.vm = vm;
    const hasProto = '__proto__' in {}
    const arrayKeys = Object.getOwnPropertyNames(arrayMethods)
    def(value, '__ob__', this)

    if (Array.isArray(value)) {
      const augment = hasProto ? protoAugment : copyAugment;
      augment(value, arrayMethods, arrayKeys)
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
  /**
   * 侦测Array中的每一项
   * **/
  observeArray(items) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i], this.vm)
    }
  }
  walk(data) {

    Object.keys(data).forEach(key => {

      defineReactive(data, key, data[key]);
      //代理data中的属性到vue实例上

    })

  }
  
  //代理属性访问
  proxyData(key) {

    console.log(key)
    let vm = this.vm;

    Object.defineProperty(vm, key, {
      get() {

        return vm._data[key]
      },
      set(newVal) {

        vm._data[key] = newVal
      }
    })
  }


}


function protoAugment(target, src, keys) {
  target.__proto__ = src
}

function copyAugment(target, src, keys) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}

function isObject(val) {
  return typeof val === 'object'

}

function observe(value, asRootData) {
  if (!isObject(value)) {
    return
  }
  let ob
  if (value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else {

    ob = new Observer(value, asRootData)
  }

  // ob = new Observer(value, asRootData)
  return ob
}