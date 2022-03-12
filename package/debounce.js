const myDebounce = (fn,delay)=>{
  let timer = -1;
  return ()=>{
    if(timer>-1){
      clearTimeout(timer);
      timer =-1;
    }
    timer=setTimeout(fn,delay)
  }
}