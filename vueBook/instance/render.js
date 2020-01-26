function renderMinix(Vue) {
  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn,this)
  }
  
}