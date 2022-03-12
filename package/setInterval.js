const mySetInterval=(cb,delay)=>{
  const context =this;
  const timer = setTimeout(()=>{
    cb.call(context);
    clearTimeout(timer);
    mySetInterval(cb,delay)
  },delay);
}