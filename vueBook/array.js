const arrayProto = Array.prototype;
const arrayMethods = Object.create(arrayProto);


['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reserse'].forEach(method => {
  //缓存原始方法
  const original = arrayProto[method]; //原始数组方法

  def(arrayMethods, method, function mutator(...args) {


    const result = original.apply(this, args);
    const ob = this.__ob__;
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    
    if (inserted) {
      ob.observeArray(inserted)
    }
    ob.dep.notify(result);

    return result
  })

  //代理


  return arrayMethods
})