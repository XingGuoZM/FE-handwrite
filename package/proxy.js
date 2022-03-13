const myProxy = (obj,handler)=>{
  const _target = JSON.parse(JSON.stringify(obj));
  Object.keys(_target).forEach(key=>{
    Object.defineProperties(_target,key,{
      get:()=>handler.get && handler.get(obj,key),
      set:newValue=>handler.set && handler.set(obj,key,newValue)
    })
  })
  return _target;
}