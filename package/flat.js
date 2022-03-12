const myFlat = (list,res)=>{
  for(let item of list){
    if(Array.isArray(item)){
      res.concat(myFlat(item,res));
    }else{
      res.push(item);
    }
  }
}