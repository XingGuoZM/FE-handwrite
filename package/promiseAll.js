const myPromiseAll=(promises)=>{
  return new Promise((resolve,reject)=>{
    const ans =[];
    let count=0;
    for(let i=0;i<promises.length;i++){
      (function(){
        Promise.resolve(promises[i]).then(res=>{
          ans[i] = res;
          count++;
          if(count===ans.length) resolve(ans);
        },err=>{
          reject(err);
        })
      })(i)
    }
  });
}
