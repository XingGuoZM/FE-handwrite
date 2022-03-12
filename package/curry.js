const curry = (fn,len,...args) => {
  return (...newArgs)=>{
    let _args = [...args,...newArgs];
    if(_args.length>=len){
      return fn.apply(this,_args);
    }
    return curry.call(this,fn,len,..._args)
  }
} 
const myCurry = (fn,len = fn.length)=>{
  return curry.call(this,fn,len)
}

