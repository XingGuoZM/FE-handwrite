/**
 * 块级作用域下有效
 * 不能重复声明
 * 不能预处理，不存在变量提升，即未声明之前的代码不能调用
 */
  (function(){
    var i = 0;
    console.log(i)
  })()