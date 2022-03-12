const myThrottle = (fn,delay)=>{
  let timer = -1;
  return ()=>{
    if(timer === -1){
      timer = setTimeout(()=>{
        fn();
        clearTimeout(timer);
        timer =-1;
      },delay)
    }
  }
}