class MyVue {
  //构造函数参数
  constructor(option) {
    this.$option = option;
    this._data = option.data;
    //数据
    this.observer(this._data);
    //对html中的数据进行编译
    this.compile(option.el)
  }

  observer(data) {
    Object.keys(data).forEach(key => {
      //获取值
      let value = data[key];
      //实例化dep
      let dep = new Dep();
      Object.defineProperty(data, key, {
        configurable: true,
        enumerable: true,
        get() {
          console.log('我被访问了');
          if (Dep.target) {
            dep.addSub(Dep.target)
          }
          return value
        },
        set(newVal) {
          if (newVal == value) {
            return false
          }
          value = newVal;
          dep.notify(newVal)

        }

      })
    })

  }
  //编译元素
  compile(el) {
    //查找元素
    let element = document.querySelector(el);
    this.compileNodes(element)
  }
  compileNodes(element) {

    //获取子元素
    let childNodes = element.childNodes;
    //将其转化为数组
    Array.from(childNodes).forEach(node => { //node为每一个节点
      //如果为3为文本节点
      if (node.nodeType === 3) {
        //文本节点查找元素并对其赋值
        let reg = /\{\{\s*(\S*)\s*\}\}/;
        let nodeContent = node.textContent;
        if (reg.test(nodeContent)) {
          node.textContent = this._data[RegExp.$1];
          //实例化Watcher 将vm进行传入
          new Watcher(this, RegExp.$1, newVal => {
            //将新的进行赋值
            node.textContent = newVal;
          })
        }
        //元素节点
      } else if (node.nodeType === 1) {
        let attrs = node.attributes;
        Array.from(attrs).forEach(attr => {
          let attrName = attr.name;
          let attrValue = attr.value;
          if (attrName.indexOf('k-') == 0) {

            node.value = this._data[attrValue];
            new Watcher(this, attrValue, newVal => {
              //将新的进行赋值
              node.value = newVal;
            })
            node.addEventListener('input', (e) => {
              this._data[attrValue] = e.target.value
            })
          }

        })

      }
      //如果还存在子节点进行递归操作
      if (node.childNodes.length) {
        this.compileNodes(node)
      }
    })

  }
}