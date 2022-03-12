const quickSort = (arr)=>{
  const left =[];
  const right =[];
  const flag = arr.splice(0,1);
  for(let i=0;i<arr.length;i++){
    if(flag<arr[i]){
      right.push(arr[i]);
    }else{
      left.push(arr[i]);
    }
  }
  return quickSort(left).concat(flag,quickSort(right));
}