const myPromiseRetry = (promise,times)=>{
  return new Promise((resolve,reject)=>{
    const fn = promise().then(res=>{
      resolve(res);
    }).catch(err=>{
      if(times>0){
        times--;
        fn();
      }else{
        console.error('重试次数使用完毕');
        reject(err);
      }
    })
    fn();
  })
}