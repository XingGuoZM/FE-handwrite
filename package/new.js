// 实现一：
const myNew = (fn,...args)=>{
  const obj = {};
  // 补齐原型链
  obj.__proto__ = fn.prototype;
  // 补齐this指向
  const ret = fn.call(obj,...args);
  return typeof ret === 'object' ? ret:obj;
}

// 实现二：
function myNew2(){

  const Constructor = [].shift.call(arguments);
  const obj = Object.create(Constructor.prototype);
  const ret = Constructor.apply(obj,arguments);
  return typeof ret === 'object' ? ret:obj;
}