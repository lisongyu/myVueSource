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
    el: null


  }
}


//render
//要渲染的虚拟dom，容器

function render(vnode, container) {
  //区分首次渲染和在此渲染
  mount(vnode, container)

}



//首次挂载元素】
function mount(vnode, container) {
  let {
    flag
  } = vnode

  if (flag == vnodeType.HTML) {
    mountElement(vnode, container)
  } else if (flag == vnodeType.TEXT) {

    mountText(vnode, container)
  }
}

function mountElement(vnode, container) {
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
      patchData(dom,key,null,data[key])
    }
  }
  if (childrenFlag == childType.SINGLE) {
    mount(children, dom)

  } else if (childrenFlag == childType.MULTIPLE) {
    for (let i = 0; i < children.length; i++) {

      mount(children[i], dom)
    }
  }

  container.appendChild(dom)

}

function mountText(vnode, container) {
  let dom = document.createTextNode(vnode.children);
  vnode.el = dom
  container.appendChild(dom)

}

function patchData(el, key, pre, next) {
  switch(key){
    case "style":
    for (let k in next) {
      el.style[k]=next[k]
    }
      break;
    
    case 'class':
      el.className = next
      break
    default:
      if (key[0] === '@') {
        if (next) {
          el.addEventListener(key.slice(1), next)
        }
      } else {
        el.setAttribute(key, next)
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