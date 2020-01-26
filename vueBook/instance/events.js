function initEvents(vm) {
  vm._events = Object.create(null);

}


function eventsMixin(Vue) {

  Vue.prototype.$on = function (event, fn) {

    const vm = this;

    //为数组时
    if (Array.isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        this.$on(event[i], fn)
      }
      //不为数组
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn)
    }

  }
  Vue.prototype.$off = function (event, fn) {
    const vm = this
    //移除所有事件的监听
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events 监听器为数组时
    if (Array.isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        this.$off(event[i], fn)
      }
      return vm
    }

    const cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    //移除该事件的所有监听器
    if (arguments.length === 1) {
      vm._events[event] = null
      return vm
    }
    //只移除与fn相同的监听器
    if (fn) {
      let cb;

      for (let i = cbs.length - 1; i >= 0; i--) {
        cb = cbs[i];
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i, 1)
          break
        }
      }
    }
    return vm
  }
  //只执行一次
  Vue.prototype.$once = function (event, fn) {
    const vm = this

    function on() {
      vm.$off(event, on)
      fn.apply(vm, arguments)
    }
    on.fn = fn
    vm.$on(event, on)
    return vm
  }

  Vue.prototype.$emit = function (event) {
    const vm = this;

    let cbs = vm._events[event]
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs
      const args = toArray(arguments, 1)
      for (let i = 0, l = cbs.length; i < l; i++) {

        cbs[i].apply(vm, args)
      }
    }
    return vm
  }
}