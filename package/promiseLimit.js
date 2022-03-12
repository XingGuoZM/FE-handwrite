//promise并发限制，方式一
const url = ['url1','url2','url3','url4','url5'];
const request = (url)=>{
  return new Promise((resolve)=>{
    setTimeout(()=>resolve(url),1000)
  })
}
const addTask = (task)=>{
  const currTask = request(task);
  pool.push(currTask);
  runTask(currTask)
}
const runTask = (task)=>{
  task.then(res=>{
    console.log(res);
    pool.splice(pool.indexOf(task),1);
    const next = url.shift();
    if(next) {
      addTask(next);
    }
  })
}
const pool = [];
const max = 2;
while(pool.length<max){
  const task = url.shift();
  addTask(task);
}
//promise并发限制，方式二
const request = url =>{
  return new Promise(resolve=>{
    setTimeout(()=>{
      resolve(url);
    },1000)
  })
}
const addTask = (url)=>{
  const task = request(url);
  pool.push(task);
  task.then(res=>{
    console.log(res);
    pool.splice(pool.indexOf(task),1);
  });
}
const runTask = (race)=>{
  race.then(res=>{
    let url = urls.shift();
    if(url!==undefined){
      addTask(url);
      runTask(Promise.race(pool));
    }
  })
}
let urls = ['url1','url2','url3','url4','url5'];
let pool = [];
let max = 3;
while(pool.length<max){
  let url = urls.shift();
  addTask(url);
}
const race = Promise.race(pool);
runTask(race);
//promise并发限制，方式三
const request = url =>{
  return new Promise(resolve=>{
    setTimeout(()=>{
      resolve(url);
    },1000)
  })
}
const limit = async ()=>{
  const urls = ['url1','url2','url3','url4','url5','url6'];
  let pool = [];
  let max = 2;
  for(let i =0;i<urls.length;i++){
    let url =urls[i];
    let task = request(url);
    task.then(data=>{
      pool.splice(pool.indexOf(task),1);
      console.log(data);
    });
    pool.push(task);
    if(pool.length === max){
      await Promise.race(pool);
    }
  }
}

limit();
