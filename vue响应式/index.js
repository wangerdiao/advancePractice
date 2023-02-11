var user = {
  name: '刘凯',
  birth: '2002-5-7',
};

observe(user) //监视对象中的属性，当属性发生变化时可以自动执行依赖该属性的函数

// 显示姓氏
function showFirstName() {
  document.querySelector('#firstName').textContent = '姓：' + user.name[0];
}

// 显示名字
function showLastName() {
  document.querySelector('#lastName').textContent = '名：' + user.name.slice(1);
}

// 显示年龄
function showAge() {
  var birthday = new Date(user.birth);
  var today = new Date();
  today.setHours(0), today.setMinutes(0), today.setMilliseconds(0);
  thisYearBirthday = new Date(
    today.getFullYear(),
    birthday.getMonth(),
    birthday.getDate()
  );
  var age = today.getFullYear() - birthday.getFullYear();
  if (today.getTime() < thisYearBirthday.getTime()) {
    age--;
  }
  document.querySelector('#age').textContent = '年龄：' + age;
}

//自动执行依赖的函数
autoRun(showFirstName)
autoRun(showLastName)
autoRun(showAge)

// user.name='王二掉'
// //当数据变化是，就需要重新调用依赖该数据的函数，较为繁琐
// showFirstName()
// showLastName()
//可以使用Object.defineProperty简化