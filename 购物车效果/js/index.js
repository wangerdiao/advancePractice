//对单个商品的包装
class UIGoods {
    constructor(g) {
        this.data = g;
        this.choose = 0
    }
    //获取单个单品的总价
    getTotalPrice() {
        return this.data.price * this.choose
    }
    //判断商品是否选中
    isChoose() {
        return this.choose>0
    }
    //商品选择数量+1
    increase() {
        this.choose++
    }
    //商品选择数量-1
    decrease() {
        if(this.choose===0) {
            return
        }
        this.choose--
    }
} 
//整个页面数据的封装
class UIData{
    constructor() {
        let uiGoods = goods.map(item => {
            return new UIGoods(item)  //对每个商品进行包装
        })
        this.uiGoods  = uiGoods
        this.deliveryCost = 5 //配送费
        this.deliveryThreshold = 30 //配送门槛
    }
    //获取选中的商品的总价
    getTotalPrice() {
        let totalPrice = this.uiGoods.reduce((previousValue, currentValue)=> {
            return previousValue + currentValue.data.price * currentValue.choose
        },0 )
        return totalPrice
    }
    //获取总共选中商品的数量
    getGoodsInCar() {
        let totalGoods = this.uiGoods.reduce((previousValue, currentValue)=> {
            return previousValue + currentValue.choose
        },0 )
        return totalGoods
    }
    //商品选中数量+1
    increase(index) {
        this.uiGoods[index].increase()
    }
    //商品选中数量-1
    decrease(index) {
        this.uiGoods[index].decrease()
    }
    //判断是否有商品在购物车
    hasGoodsInCar() {
        return this.getGoodsInCar()>0
    }
    //判断是否到达配送门槛
    hasCrossDeliveryThreshold() {
        return this.getTotalPrice()>this.deliveryThreshold
    }
    //判断是否选择商品
    isChoose(index) {
        return this.uiGoods[index].isChoose()
    }
}
//整个界面
class UI {
    constructor() {
        const uiData = new UIData()
        this.uiData = uiData
        //获取界面中所需要的dom元素
        this.doms = {
            goodsContainer: document.querySelector('.goods-list'),
            deliveryPrice: document.querySelector('.footer-car-tip'),
            footerPay: document.querySelector('.footer-pay'),
            footerPayInnerSpan: document.querySelector('.footer-pay span'),
            totalPrice: document.querySelector('.footer-car-total'),
            car: document.querySelector('.footer-car'),
            badge: document.querySelector('.footer-car-badge'),
        }
        //获取图片跳到最终位置的坐标
        let carRect = this.doms.car.getBoundingClientRect();
        let jumpTarget = {
        x: carRect.left + carRect.width / 2,
        y: carRect.top + carRect.height / 5,
        };
        this.jumpTarget = jumpTarget;

        this.createHMTL()
        this.updateFooter()
        this.listenEvent()
    }
    //创建HTML元素
    createHMTL() {
        let html = ''
        this.uiData.uiGoods.forEach((item,index) => {
            html+=`<div class="goods-item">
      <img src="${item.data.pic}" alt="" class="goods-pic">
      <div class="goods-info">
        <h2 class="goods-title">${item.data.title}</h2>
        <p class="goods-desc">${item.data.desc}</p>
        <p class="goods-sell">
          <span>月售 ${item.data.sellNumber}</span>
          <span>好评率${item.data.favorRate}%</span>
        </p>
        <div class="goods-confirm">
          <p class="goods-price">
            <span class="goods-price-unit">￥</span>
            <span>${item.data.price}</span>
          </p>
          <div class="goods-btns">
            <i index="${index}" class="iconfont i-jianhao"></i>
            <span>${item.choose}</span>
            <i index="${index}" class="iconfont i-jiajianzujianjiahao"></i>
          </div>
        </div>
      </div>
    </div>`
        })
        this.doms.goodsContainer.innerHTML = html;
    }
    //获取总价
    getTotalPrice() {
        return this.uiData.getTotalPrice()
    }
    //商品数量+1
    increase(index) {
        this.uiData.increase(index)
        this.updatePage(index)
        this.updateFooter()
        this.jump(index)
    }
    //商品数量-1
    decrease(index) {
        this.uiData.decrease(index)
        this.updatePage(index)
        this.updateFooter()
    }
    //更新页面
    updatePage(index) {
        let goodsDom = this.doms.goodsContainer.children[index];
        if(this.uiData.isChoose(index)) {
            goodsDom.classList.add('active');
        }else {
            goodsDom.classList.remove('active');
        }
        let span = goodsDom.querySelector('.goods-btns span');
        span.textContent = this.uiData.uiGoods[index].choose;
    }
    //更新页脚
    updateFooter() {
        // 得到总价数据
        const total = this.uiData.getTotalPrice();
        // 设置配送费
        this.doms.deliveryPrice.textContent = `配送费￥${this.uiData.deliveryPrice}`;
        // 设置起送费还差多少
    if (this.uiData.hasCrossDeliveryThreshold()) {
        // 到达起送点
        this.doms.footerPay.classList.add('active');
      } else {
        this.doms.footerPay.classList.remove('active');
        // 更新还差多少钱
        let dis = this.uiData.deliveryThreshold - total;
        dis = Math.round(dis);
        this.doms.footerPayInnerSpan.textContent = `还差￥${dis}元起送`;
      }
      // 设置总价
    this.doms.totalPrice.textContent = total.toFixed(2);
     // 设置购物车的样式状态
     if (this.uiData.hasGoodsInCar()) {
        this.doms.car.classList.add('active');
      } else {
        this.doms.car.classList.remove('active');
      }
      // 设置购物车中的数量
      this.doms.badge.textContent = this.uiData.getGoodsInCar();
    }
    // 监听各种事件
    listenEvent() {
        this.doms.car.addEventListener('animationend', function () {
        this.classList.remove('animate');
        });
    }
    // 购物车动画
    carAnimate() {
        this.doms.car.classList.add('animate');
    }
    jump(index) {
        //获取图标起始位置的坐标
        let btnAdd = this.doms.goodsContainer.children[index].querySelector(
            '.i-jiajianzujianjiahao'
          );
          let rect = btnAdd.getBoundingClientRect();
          console.log(rect);
          let start = {
            x: rect.left,
            y: rect.top,
          };
          console.log(start.x,start.y);
        //创建元素开始跳跃
          let div = document.createElement('div');
          div.className = 'add-to-car';
          let i = document.createElement('i');
          i.className = 'iconfont i-jiajianzujianjiahao';
          // 设置初始位置
          div.style.transform = `translate(${start.x}px,${start.y}px)`;
          div.appendChild(i);
          document.body.appendChild(div);
          // 强行渲染 （为避免浏览器解析完js后才解析css，即执行完js后图标最终位置直接到了目标位置，没有中间跳跃的过程）
          div.clientWidth;
          // 设置结束位置
        div.style.transform = `translate(${this.jumpTarget.x}px,${this.jumpTarget.y}px)`;
        let that = this;
        div.addEventListener(
        'transitionend',
        function () {
            div.remove();
            that.carAnimate();
        },
        {
            once: true, // 事件仅触发一次,防止事件冒泡
        }
        );
    }
}
const ui = new UI()

// 事件
ui.doms.goodsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('i-jiajianzujianjiahao')) {
      var index = +e.target.getAttribute('index');
      ui.increase(index);
    } else if (e.target.classList.contains('i-jianhao')) {
      var index = +e.target.getAttribute('index');
      ui.decrease(index);
    }
  });