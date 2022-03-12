const myInstanceof = (object,constructor)=>{
  let prototype = constructor.prototype;
  object = object.__proto__;
  while(true){
    if(!object) return false;
    if(prototype == object) return true;
    object = object.__proto__;
  }
}