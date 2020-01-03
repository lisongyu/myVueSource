class Kvue {
  //接收的参数
  constructor(options) {
    this.$options = options;
    this._data = options.data;
    //劫持数据
    this.observer(this._data);
    this.compile(options.el)

  }
  //数据劫持
  observer(data) {
    Object.keys(data).forEach(key => {
      let value = data[key];
      //一个属性持有一个dep
      let dep = new Dep()
      Object.defineProperty(data, key, {
        configurable: true,
        enumerable: true,
        get() {
          if (Dep.target) {
            dep.addSub(Dep.target);
          }
          return value
        },
        set(newVal) {
          console.log("set", newVal)
          if (newVal !== value) {
            value = newVal;
            dep.notify(newVal)
          }


        }
      })
    })

  }
  //编译查找
  compile(el) {
    let element = document.querySelector(el);
    this.compileNode(element);


  }

  //需要递归的封装成一个函数
  compileNode(element) {

    let childNodes = element.childNodes;
    //console.log(childNodes)
    Array.from(childNodes).forEach(node => {
      //文本
      if (node.nodeType == 3) {
        //console.log(node)  ()为分组
        let reg = /\{\{\s*(\S*)\s*\}\}/;
        let nodeContent = node.textContent;
        if (reg.test(nodeContent)) {
          //进行渲染
          console.log(RegExp.$1)
      
          node.textContent = this._data[RegExp.$1];
          //回调函数触发
          new Watcher(this, RegExp.$1, newValue => {
            node.textContent = newValue
          })
        }
        //标签
      } else if (node.nodeType == 1) {
        let attrs = node.attributes; //元素属性
        Array.from(attrs).forEach(attr => {
          let attrName = attr.name;
          let attrValue = attr.value;
          if (attrName.indexOf("k-") == 0) {
            attrName = attrName.substr(2);
            if (attrName == 'model') {
              node.value = this._data[attrValue]

              //回调函数触发
              new Watcher(this, attrValue, newValue => {
                node.value = newValue
              })
            }
            node.addEventListener("input", e => {
              //console.log(e.target.value)
              this._data[attrValue] = e.target.value
            })
          }
        })

      }
      //递归循环 有子节点
      if (node.childNodes.length) {
        this.compileNode(node)
      }

    })

  }
}