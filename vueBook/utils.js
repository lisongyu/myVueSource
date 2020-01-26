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
  if ((!isA && !isObject(val)) || Object.isFrozen(val)) {
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

//有效的索引值
function isValidArrayIndex(val) {
  const n = parseFloat(String(val))
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}


//
const hasOwnProperty = Object.prototype.hasOwnProperty

function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key)
}


function toArray(list, start) {
  start = start || 0
  let i = list.length - start
  const ret = new Array(i)
  while (i--) {
    ret[i] = list[i + start]
  }
  return ret
}


function isNative(Ctor){
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}