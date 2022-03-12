const myCompose=(...fns)=>{
  let isFirst = true;
  return fns.reduceRight((result,fn)=>{
    if(isFirst){
      isFirst=false;
      return fn(...result);
    }
    return fn(result);
  },args)
}