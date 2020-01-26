const vnodeType = {
  HTML: "HTML",
  TEXT: "TEXT",
  COMPONENT: "COMPONENT",
  CLASS_COMPONENT: 'CLASS_COMPONENT'
}

const childType = {
  EMPTY: 'EMPTY',
  SINGLE: 'SINGLE',
  MULTIPLE: 'MULTIPLE'
}
//新建虚拟dom
//名字属性和子元素
function createElement(tag, data, children = null) {
  let flag
  if (typeof tag == 'string') {

    //普通的html标签
    flag = vnodeType.HTML
  } else if (typeof tag == 'function') {
    flag = vnodeType.COMPONENT
  } else {
    flag = vnodeType.TEXT
  }

  let childrenFlag

  if (children == null) {
    childrenFlag = childType.EMPTY
  } else if (Array.isArray(children)) {
    let length = children.length
    if (length === 0) {
      childrenFlag = childType.EMPTY
    } else {
      childrenFlag = childType.MULTIPLE
    }
  } else {
    //其他情况以为是文本
    childrenFlag = childType.SINGLE
    children = createTextVnode(children + '')


  }
  //返回vnode
  return {
    flag, //vnode类型
    tag, //标签，div 文本没有tag,组件就是函数
    data,
    children,
    childrenFlag,
    key: data && data.key,
    el: null


  }
}


//render
//要渲染的虚拟dom，容器

function render(vnode, container) {
  //区分首次渲染和在此渲染
  if (container.vnode) {
    //更新
    patch(container.vnode, vnode, container)
  } else {
    mount(vnode, container)
  }


  container.vnode = vnode

}

function patch(prev, next, container) {
  let nextFlag = next.flag
  let prevFlag = prev.flag
  //如果prev 是div next是p 直接替换
  if (nextFlag !== prevFlag) {
    replaceVnode(prev, next, container)
  } else if (nextFlag == vnodeType.HTML) {
    patchElement(prev, next, container)
  } else if (nextFlag == vnodeType.TEXT) {
    patchText(prev, next, container)

  }

}


function patchElement(prev, next, container) {
  if (prev.tag !== next.tag) {
    replaceVnode(prev, next, container)
    return

  }
  let el = (next.el = prev.el)
  let prevData = prev.data
  let nextData = next.data
  if (nextData) {
    for (let key in nextData) {
      let prevVal = prevData[key]
      let nextVal = nextData[key]

      patchData(el, key, prevVal, nextVal)
    }
  }

  //删除
  if (prevData) {
    for (let key in prevData) {
      let prevVal = prevData[key]

      if (prevVal && !nextData.hasOwnProperty(key)) {

        patchData(el, key, prevVal, null)

      }
    }
  }
  //data 更新完毕  下面更新子元素
  //patchChildren
  patchChildren(
    prev.childrenFlag,
    next.childrenFlag,
    prev.children,
    next.children,
    el
  )
}

function patchChildren(
  prevChildFlags,
  nextChildFlags,
  prevChildren,
  nextChildren,
  container
) {
  //更新子元素
  //1.老的是单独的，老的是空的，老的是多个
  //2.新的是单独的，新的是多个
  switch (prevChildFlags) {
    // 旧的 children 是单个子节点，会执行该 case 语句块
    case childType.SINGLE:
      switch (nextChildFlags) {
        case childType.SINGLE:
          // 新的 children 也是单个子节点时，会执行该 case 语句块
          patch(prevChildren, nextChildren, container)
          break
        case childType.EMPTY:
          // 新的 children 中没有子节点时，会执行该 case 语句块
          container.removeChild(prevChildren.el)
          break
        default:
          // 但新的 children 中有多个子节点时，会执行该 case 语句块
          container.removeChild(prevChildren.el)
          for (let i = 0; i < nextChildren.length; i++) {
            mount(nextChildren[i], container)
          }
          break
      }
      break
      // 旧的 children 中没有子节点时，会执行该 case 语句块
    case childType.EMPTY:
      switch (nextChildFlags) {
        case childType.SINGLE:
          // 新的 children 是单个子节点时，会执行该 case 语句块
          mount(nextChildren, container)
          break
        case childType.EMPTY:
          // 新的 children 中没有子节点时，会执行该 case 语句块
          break
        default:
          // 但新的 children 中有多个子节点时，会执行该 case 语句块
          for (let i = 0; i < nextChildren.length; i++) {
            mount(nextChildren[i], container)
          }
          break
      }
      break
      // 旧的 children 中有多个子节点时，会执行该 case 语句块
    default:
      switch (nextChildFlags) {
        case childType.SINGLE:
          for (let i = 0; i < prevChildren.length; i++) {
            container.removeChild(prevChildren[i].el)
          }
          mount(nextChildren, container)
          break
        case childType.EMPTY:
          for (let i = 0; i < prevChildren.length; i++) {
            container.removeChild(prevChildren[i].el)
          }
          break
        default:
          // 但新的 children 中有多个子节点时，会执行该 case 语句块
          let lastIndex = 0
          for (let i = 0; i < nextChildren.length; i++) {
            const nextVNode = nextChildren[i]
            let j = 0,
              find = false
            for (j; j < prevChildren.length; j++) {
              const prevVNode = prevChildren[j]
              if (nextVNode.key === prevVNode.key) {
                find = true
                patch(prevVNode, nextVNode, container)
                if (j < lastIndex) {
                  // 需要移动
                  const refNode = nextChildren[i - 1].el.nextSibling
                  container.insertBefore(prevVNode.el, refNode)
                  break
                } else {
                  // 更新 lastIndex
                  lastIndex = j
                }
              }
            }
            if (!find) {
              // 挂载新节点
              const refNode =
                i - 1 < 0 ?
                prevChildren[0].el :
                nextChildren[i - 1].el.nextSibling

              mount(nextVNode, container, refNode)
            }
          }
          // 移除已经不存在的节点
          for (let i = 0; i < prevChildren.length; i++) {
            const prevVNode = prevChildren[i]
            const has = nextChildren.find(
              nextVNode => nextVNode.key === prevVNode.key
            )
            if (!has) {
              // 移除
              container.removeChild(prevVNode.el)
            }
          }
          break
      }
      break
  }
}

function patchText(prev, next) {
  let el = (next.el = prev.el)
  if (next.children !== prev.children) {
    el.nodeValue = next.children
  }
}

function replaceVnode(prev, next, container) {
  //类型不相等直接移除
  container.removeChild(prev.el)
  mount(next, container)

}



//首次挂载元素】
function mount(vnode, container, flagNode) {
  let {
    flag
  } = vnode

  if (flag == vnodeType.HTML) {
    mountElement(vnode, container, flagNode)
  } else if (flag == vnodeType.TEXT) {

    mountText(vnode, container)
  }
}

function mountElement(vnode, container, flagNode) {
  let dom = document.createElement(vnode.tag)

  vnode.el = dom

  let {
    data,
    children,
    childrenFlag
  } = vnode;
  //挂钩data属性
  if (data) {
    for (let key in data) {
      //节点,名字,老值
      patchData(dom, key, null, data[key])
    }
  }
  if (childrenFlag == childType.SINGLE) {
    mount(children, dom)

  } else if (childrenFlag == childType.MULTIPLE) {
    for (let i = 0; i < children.length; i++) {

      mount(children[i], dom)
    }
  }

  flagNode ? container.insertBefore(dom, flagNode) : container.appendChild(dom)

}

function mountText(vnode, container) {
  let dom = document.createTextNode(vnode.children);
  vnode.el = dom
  container.appendChild(dom)

}

function patchData(el, key, pre, next) {
  switch (key) {
    case "style":
      for (let k in next) {
        el.style[k] = next[k]
      }

      for (let k in pre) {
        console.log(next)
        if (!next.hasOwnProperty(k)) {
          el.style[k] = ''
        }

      }

      break;

    case 'class':
      el.className = next
      break
    default:
      if (key[0] === '@') {
        if (pre) {
          el.removeEventListener(key.slice(1), pre)
        }
        if (next) {
          el.addEventListener(key.slice(1), next)
        }
      } else {
        el && el.setAttribute(key, next)
      }
      break;
  }

}
//新建文本类型的vnode
function createTextVnode(text) {

  return {
    flag: vnodeType.TEXT, //vnode类型
    tag: null, //标签，div 文本没有tag,组件就是函数
    data: null,
    children: text,
    childrenFlag: childType.EMPTY


  }

}