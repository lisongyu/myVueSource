function del(target,key) {
  //如果是数组
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1)
    return
  }

  const ob = target.__ob__;
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  //如果不存在直接终止程序

  if (!ob) {
    return
  }
  ob.dep.notify()
}