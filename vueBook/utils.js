function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    congigurable: true
  })
}




/**
 * Parse simple path.
 */
const bailRE = /[^\w.$]/

function parsePath(path) {

  if (bailRE.test(path)) {
    return
  }

  const segments = path.split('.')
  return function (obj) {

    for (let i = 0; i < segments.length; i++) {
      if (!obj) return
      //访问属性  触发收集

      obj = obj[segments[i]]
    }
  
    return obj
  }
}
const seenObjects = new Set()

function traverse(val) {
  _traverse(val, seenObjects);
  seenObjects.clear();

}

function _traverse(val, seen) {
  let i, keys
  const isA = Array.isArray(val)
  if ((!isA && !isObject(val)) || Object.isFrozen(val) ) {
    return
  }
  if (val.__ob__) {
    const depId = val.__ob__.dep.id
    if (seen.has(depId)) {
      return
    }
    seen.add(depId)
  }
  if (isA) {
    i = val.length
    while (i--) _traverse(val[i], seen)
  } else {
    keys = Object.keys(val)
    i = keys.length
    while (i--) _traverse(val[keys[i]], seen)
  }
}