/**
 * 
 * @param {*} key 
 * @param {*} value 
 * 用于声明一个常量
 * 块级作用域有效
 * 不能重复声明
 * 不能预处理，不存在变量提升，未声明之前不能调用
 * 不能修改
 * 声明时必须初始化
 */
function myConst(key,value){
  window[key]=value;
  Object.defineProperty(window,key,{
    enumerable:false,
    configurable:false,
    get:function(){
      return value;
    },
    set:function(newValue){
      if(newValue!==value){
        throw TypeError('这是只读变量，不可修改')
      }else{
        return value;
      }
    }
  })

}