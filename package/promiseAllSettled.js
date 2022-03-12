const myPromiseAllSettled =(promises)=>{
  return Promise.all(promises.map(promise=>Promise.resolve(promise).then(res=>({status:'fulfilled',res},err=>({status:'rejected',err})))))
}
