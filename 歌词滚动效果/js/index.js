/*
    修改原始数据 [00:01.06]难念的经
    改为 lrc= {
        time:1.06
        lrcContent:难念的经
    }
*/
let lrcList = lrc.split('\n')
//切割换行符 变成[02:21.14]怕幸运会转眼远逝 这样一句的字符串
//newLrc形成一个数组 类似与['[02:21.14]怕幸运会转眼远逝']
const newLrcList = []
lrcList.forEach(item => {
    const lrcContent = item.split(']')[1]  //拿到歌词部分
    const timeStr = item.split(']')[0].slice(1) //拿到歌词对应的时间
    const time = parseTime(timeStr).toFixed(2)
    const lrcObject = {
        time,
        lrcContent
    }
    newLrcList.push(lrcObject)
},
)

//计算时间的函数  参数time的形式为 '02:21.14'
function parseTime(time) {
    const parts = time.split(':')
    return +parts[0]*60 + +parts[1]
}

//获取到需要的dom
const doms = {
    audio: document.querySelector('audio'),
    ul: document.querySelector('.container ul'),
    container: document.querySelector('.container'),
};

//判断对应的时间对应的歌词显示高亮效果,返回值为歌词的索引
function findActiveIndex() {
    const currentTime = doms.audio.currentTime; //当前歌曲播放的时间
    const index = newLrcList.findIndex((item,index) => {
        return currentTime<item.time  //返回符合当前判断的序号,当没有找到是时会返回-1
    })
    return index-1
}
findActiveIndex()


//创建歌词元素li
function createElementLrcList() {
    const frag = document.createDocumentFragment() //文档
    newLrcList.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.lrcContent
        frag.appendChild(li) //改动dom树
    })
    doms.ul.appendChild(frag)
}
createElementLrcList()

// 容器高度
var containerHeight = doms.container.clientHeight;
console.log(containerHeight);
// 每个 li 的高度
var liHeight = doms.ul.children[0].clientHeight;
// 最大偏移量
var maxOffset = doms.ul.clientHeight - containerHeight;
console.log(maxOffset);
//添加高亮效果，以及设置ul的偏移量
function showActive() {
console.log(containerHeight);
console.log(maxOffset);

    let index = findActiveIndex() //找到当前时间对应的歌词
    let offSetTop = liHeight*index + liHeight/2 + index *10 - containerHeight/2
    console.log(offSetTop);
    //绝对情况 歌词快播放完成时，页面不再滚动
    if(offSetTop>maxOffset) {
        offSetTop =  maxOffset
    }
    //绝对情况  找不到对应index返回负数
    if(offSetTop<0) {
        offSetTop = 0
    }
    doms.ul.style.transform = `translateY(-${offSetTop}px)` //向上滚动的距离
     let li = doms.ul.querySelector('.active')
    //排他思想
    if(li) {
        li.classList.remove('active')
    }
    li = doms.ul.children[index]
    if(li) li.classList.add('active')
}

doms.audio.addEventListener('timeupdate',showActive)

