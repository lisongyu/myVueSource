class Compile {
  constructor(el, vm) {
    this.$el = document.querySelector(el);
    this.$vm = vm;
    //编译  先拿出片段
    if (this.$el) {
      //转换内部内容为片段
      this.$fragment = this.node2Fragment(this.$el)
      //执行编译
      this.compile(this.$fragment)
      //将编译完的结果追加至$el
      this.$el.appendChild(this.$fragment)
    }

  }
  //将宿主元素中代码片段拿出来遍历，这样比较高效
  node2Fragment(el) {
    const frag = document.createDocumentFragment();
    //将el所有子元素搬家至frag中
    let child;
    while (child = el.firstChild) {
      frag.appendChild(child);
    }
    return frag
  }
  compile(el) {
    let childNodes = el.childNodes;
    //将其转化为数组
    Array.from(childNodes).forEach(node => { //node为每一个节点
      //判断类型

      if (this.isElement(node)) {

        const nodeAttrs = node.attributes;
        Array.from(nodeAttrs).forEach(attr => {
          let attrName = attr.name; //属性名
          let attrValue = attr.value;

          //如果指令
          if (this.isDirective(attrName)) {
            const dir = attrName.substring(2); //截取 k-后面的内容
            this[dir] && this[dir](node, this.$vm, attrValue)
          }
          //如何事件
          if (this.isEvent(attrName)) {
            let dir = attrName.substring(1); //@click
            this.eventHandler(node, this.$vm, attrValue, dir)
          }
        })
        //元素
      } else if (this.isInterpolation(node)) {

        this.compileText(node);
      }
      if (node.childNodes && node.childNodes.length) {
        this.compile(node)
      }
    })
  }
  text(node, vm, exp) {
    this.update(node, vm, exp, 'text')
  }
  //双向绑定
  model(node, vm, exp) {
    //制定input value属性
    this.update(node, vm, exp, "model");
    //视图对模型的响应
    node.addEventListener("input", e => {
      vm[exp] = e.target.value;
    })
  }
  html(node, vm, exp) {
    this.update(node, vm, exp, 'html')
  }

  modelUpdater(node, value) {
    node.value = value
  }
  textUpdater(node, val) {

    node.textContent = val;
  }
  htmlUpdater(node, value) {
    node.innerHTML = value
  }
  isDirective(attr) {
    return attr.indexOf('k-') === 0
  }
  isEvent(attr) {
    return attr.indexOf('@') === 0
  }
  //事件 处理器
  eventHandler(node, vm, exp, dir) {
    let fn = vm.$option.methods && vm.$option.methods[exp];
    if (dir && fn) {
      node.addEventListener(dir, fn.bind(vm))
    }
  }

  //更新函数
  update(node, vm, exp, dir) {
    const updaterFn = this[dir + 'Updater'];
    //初始化 数据
    //判断是否含有.
    var key = vm[exp]
    if (exp.indexOf('.') != -1) {
      let expArr = exp.split('.');
      key = this.dataData(expArr, vm);
    }
    updaterFn && updaterFn(node, key);

    //公用注册
    new Watcher(vm, exp, newVal => {

      updaterFn && updaterFn(node, newVal);

    })
  }
  dataData(expArr, vm) {
    var getKey = expArr.shift();
    //this.vm
    if (expArr.length) {
      return this.dataData(expArr,vm[getKey])
    } 
    

    return vm[getKey]
  }
  compileText(node) {

    this.update(node, this.$vm, RegExp.$1, 'text')

  }
  isElement(node) {
    return node.nodeType === 1
  }
  //插值文本
  isInterpolation(node) {
    let reg = /\{\{\s*(\S*)\s*\}\}/;

    return node.nodeType === 3 && reg.test(node.textContent)
  }
}