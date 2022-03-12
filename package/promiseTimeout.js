const promiseTimeout = (promise,delay)=>{
  return Promise.race([promise,new Promise(resolve=>{
    setTimeout(()=>resolve(),delay)
  })])
}