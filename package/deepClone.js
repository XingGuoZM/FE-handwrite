// 方法一
JSON.parse(JSON.stringify())
//方法二：
const deepClone = (target)=>{
  if(typeof target === 'object'){
    const obj = Array.isArray(target)?[]:{};
    for(let item in target){
      if(obj.hasOwnProperty(item)){
        obj[item] = deepClone(target(item));
      }
    }
  }else{
    return target;
  }
}