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
console.log(newLrcList);

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

//判断对应的时间对应的歌词显示高亮效果
function showActiveLrc() {
    const currentTime = doms.audio.currentTime; //当前歌曲播放的时间
    const index = newLrcList.findIndex((item,index) => {
        return currentTime<item.time  //返回符合当前判断的序号
    })
    return index-1
}
showActiveLrc()

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