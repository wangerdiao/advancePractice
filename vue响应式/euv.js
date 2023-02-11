/**
 * 观察某个对象的所有属性
 * 当某个对象的属性的值发生改变的时候可以自动调用依赖该属性值的函数，从而实现数据响应
 * @param {Object} obj
 */
function observe(obj) {
  for(const key in obj) {
    let innerValue = obj[key]
    let funcs = []
    Object.defineProperty(obj,key,{
      get() {
        //收集属性依赖调用的函数
        if(window.__func && !funcs.includes(window.__func)){ //数组去重
          funcs.push(window.__func)
        }
        return innerValue
      },
      set(val) {
        innerValue = val
        //执行属性依赖的函数
        funcs.forEach((item) => {
          item()
        })
      }
    })
  }
}

//可以用这样的方法来收集属性依赖调用的函数
// window.__func = showFirstName
// showFirstName()
// window.__func = null

//简单做下封装
function autoRun(fn) {
  window.__func = fn
  fn()
  window.__func = null
}





