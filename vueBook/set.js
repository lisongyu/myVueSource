//目标点 target key 属性值 val 设置的值
function set(target, key, val) {
  //处理数组

  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }
  //key 已经存在于target 中
  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }

  //处理新增的属性
  const ob = target.__ob__;
  console.log(ob)
  if (!ob) {
    target[key] = val
    return val
  }
  defineReactive(ob.value, key, val)
  ob.dep.notify()
  return val

}