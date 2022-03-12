Function.prototype.myCall = function(ctx,...args){
  ctx = ctx || window;
  args = args || [];
  const key = Symbol();
  ctx[key] = this;
  const ret = ctx[key](...args);
  delete ctx[key];
  return ret;
}