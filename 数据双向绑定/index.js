class Vue {
    constructor(obj) {
        this.$data = obj.data
        Observer(this.$data) //进行数据监听
        Compile(obj.el,this) //调用模板解析器
    }
}

//数据劫持--监听实例里的数据
function Observer(obj) {
    //递归条件的出口
    if(!obj || typeof obj !=='object') return
    const dependency = new Dependency() //创建依赖实例
    Object.keys(obj).forEach(key => {
        let value = obj[key]
        Observer(value)  //递归--子属性进行数据劫持
        Object.defineProperty(obj,key,{
            get() {
                console.log(`我访问了${key}属性,值是${value}`);
                //订阅者加入依赖实例的数组
                Dependency.temp && dependency.addSub(Dependency.temp)
                return value
            },
            set(newValue){
                console.log(`属性${key}的值为${value}修改为${newValue}`);
                value = newValue
                //如果传入的是对象，就会继续进行数据劫持
                Observer(newValue)
                //通知订阅者更新数据
                dependency.notify()
            }
        })
    })
}

//HTML模板解析--替换DOM元素
function Compile(element,vm) {
    vm.$el = document.querySelector(element)
    const fragment = document.createDocumentFragment()
    let child
    //将元素赋值给文档碎片内容
    while (child = vm.$el.firstChild) {
        fragment.append(child)
    }
    fragment_compile(fragment)
    //替换文档碎片内容
    function fragment_compile(node) {
        const pattern = /\{\{(.*)\}\}/ //插值语法的正则表达式
        if(node.nodeType === 3) { //判断是否为文本节点
            const xxx = node.nodeValue
            //匹配插值语法  
            const result_regex = pattern.exec(node.nodeValue)
            if(result_regex) {
                // result_regex为['{{name}}', 'name', index: 3, input: '姓名:{{name}}', groups: undefined]
                //['{{more.like}}', 'more.like', index: 3, input: '更多:{{more.like}}', groups: undefined]
                //当result_regex[1]为more.like这种格式的时候需要链式取值
                const arr = result_regex[1].split('.') //先将字符串转换成数组
                const value = arr.reduce( //再利用reduce方法进行链式取值
                    (total,current) => total[current],vm.$data
                )
                //替换插值表达式
                node.nodeValue = xxx.replace(pattern,value)
                //创建订阅者
                new Watcher(vm,result_regex[1],newValue => {
                    node.nodeValue = xxx.replace(pattern,newValue)
                })
            }
            return 
        }
        //获取v-model绑定的值
        if(node.nodeType === 1 && node.nodeName==='INPUT') {
            const arr = Array.from(node.attributes)
            arr.forEach( i => {
                if(i.nodeName === 'v-model') {
                    const value = i.nodeValue.split('.').reduce(
                        (total,current) => total[current],vm.$data
                    )
                   node.value = value
                   //创建订阅者实例来时刻更新自己
                   //数据改变更新视图
                   new Watcher(vm,i.nodeValue,newValue => {
                    node.value = newValue
                })
                    //视图改变来更新数据
                    node.addEventListener('input',e => {
                        // 'more.like'
                        const arr1 = i.nodeValue.split('.')
                        // ['more','like']
                        const arr2 = arr1.slice(0,arr1.length-1)
                        //vm.$data.more
                        const arr3 = arr2.reduce(
                            (total,current) => total[current],vm.$data
                        )
                        //vm.$data.more.like
                        arr3[arr1[arr1.length-1]] = e.target.value
                    })
                }
            })
        }
        //递归----遍历子节点
        node.childNodes.forEach(child => fragment_compile(child))
    }
    //将替换好的文档碎片内容放置HTML页面上
    vm.$el.appendChild(fragment) 
}

//依赖--收集和通知订阅者
class Dependency {
    constructor() {
        //创建一个数组来收集订阅者
        this.subscribers = []
    }
    addSub(sub) { //添加订阅者
        this.subscribers.push(sub)
    }
    notify() { //通知订阅者更新自己的内容 
        this.subscribers.forEach(sub => sub.update())
    }
} 

//订阅者
class Watcher { 
    constructor(vm,key,callback) {
        this.vm = vm
        this.key = key
        this.callback = callback
        //临时属性 - 触发getter,从而保存订阅者实例
        Dependency.temp = this
        key.split('.').reduce((total,current) => total[current],vm.$data)
        Dependency.temp = null
    }
    //订阅者更新自己的数据
    update() {
        const value =  this.key.split('.').reduce((total,current) => total[current],this.vm.$data)
        this.callback(value)
    }
}