Function.prototype.myBind = function(ctx,...args){
  const fn = this;
  args = args || [];
  return function newFn(...newArgs){
    if(this instanceof newFn){
      return new fn(...args,...newArgs);
    }
    return fn.apply(ctx,args.concat(newArgs))
  }
}