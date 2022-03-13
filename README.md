## 前端手写系列
- 手写call/bind
```js
Function.prototype.myCall = function(ctx,...args){
  ctx = ctx || window;
  args = args || [];
  const key = Symbol();
  ctx[key] = this;
  const ret = ctx[key](...args);
  delete ctx[key];
  return ret;
}
Function.prototype.myBind = function(ctx,...args){
  const fn = this;
  args = args || [];
  return function newFn(...newArgs){
    if(this instanceof newFn){
      return new fn(...args,...newArgs);
    }
    return fn.apply(ctx,args.concat(newArgs))
  }
}
```
- 手写节流（throttle）和防抖（debounce）
```js
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
```
- 手写柯里化（curry）和组合（compose）
```js
const curry = (fn,len,...args) => {
  return (...newArgs)=>{
    let _args = [...args,...newArgs];
    if(_args.length>=len){
      return fn.apply(this,_args);
    }
    return curry.call(this,fn,len,..._args)
  }
} 
const myCurry = (fn,len = fn.length)=>{
  return curry.call(this,fn,len)
}

const myCompose=(...fns)=>{
  let isFirst = true;
  return fns.reduceRight((result,fn)=>{
    if(isFirst){
      isFirst=false;
      return fn(...result);
    }
    return fn(result);
  },args)
}
```
- 手写实例化（new）、继承（extends）、引用类型判断（instanceof）
```js
// 实现一：
const myNew = (fn,...args)=>{
  const obj = {};
  // 补齐原型链
  obj.__proto__ = fn.prototype;
  // 补齐this指向
  const ret = fn.call(obj,...args);
  return typeof ret === 'object' ? ret:obj;
}

// 实现二：
function myNew2(){

  const Constructor = [].shift.call(arguments);
  const obj = Object.create(Constructor.prototype);
  const ret = Constructor.apply(obj,arguments);
  return typeof ret === 'object' ? ret:obj;
}
// extends
function Parent(){
  this.name='jack';
}
function Child(){
  this.age=10;
  Parent.call(this);
}

const a = new Child()
console.log(a)
// 引用类型判断
const myInstanceof = (object,constructor)=>{
  let prototype = constructor.prototype;
  object = object.__proto__;
  while(true){
    if(!object) return false;
    if(prototype == object) return true;
    object = object.__proto__;
  }
}
```
- 手写promise、promiseAll、promiseRace、promiseAllSettled
```js
const PENDING = Symbol();
const REJECTED = Symbol();
const FULLFILLED = Symbol();

const MyPromise = function(fn) {
  this.state = PENDING;
  this.value = '';

  const resolve = (value) => {
    this.state = FULLFILLED;
    this.value = value;
  }

  const reject = (error) => {
    this.state = REJECTED;
    this.value = error;
  }

  this.then = (onFullFill, onReject) => {
    if (this.state == FULLFILLED) {
      onFullFill(this.value);
    } else {
      onReject(this.value);
    }
  }

  try {
    fn(resolve, reject);
  } catch(error) {
    reject(error);
  }
}

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


const myPromiseRace=(promises)=>{
  return new Promise((resolve,reject)=>{
    promises.forEach(p=>Promise.resolve(p)).then(resolve,reject)
  })
}


const myPromiseAllSettled =(promises)=>{
  return Promise.all(promises.map(promise=>Promise.resolve(promise).then(res=>({status:'fulfilled',res},err=>({status:'rejected',err})))))
}

```
- 手写并发控制（promiseLimit）、重试（promiseRetry）、超时（promiseTimeout）
```js
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

// 重试
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
// 超时
const promiseTimeout = (promise,delay)=>{
  return Promise.race([promise,new Promise(resolve=>{
    setTimeout(()=>resolve(),delay)
  })])
}

```
- 手写但例模式、观察者模式
```js
//单例模式
function Singleton(name){
  this.name=name;
  this.instance = null;
}
Singleton.prototype.getName=function(){
  console.log(this.name);
}

Singleton.getInstance = function(name){
  if(this.instance){
    return this.instance;
  }
  return this.instance = new Singleton(name);
}

let A = Singleton.getInstance('A');
let B = Singleton.getInstance('B');

console.log(A===B);
console.log(A.getName());
console.log(B.getName());


// 观察者模式
class Observer{
  static event = new Map();
  static on = (name,fn)=>{
    this.event.set(name,{isOnce:false,fn})
  }
  static once = (name,fn)=>{
    this.event.set(name,{isOnce:true,fn});
  }
  static off = (name)=>{
    this.event.delete(name);
  }
  static emit = (name,data)=>{
    let cashe = this.event.get(name);
    if(cashe){
      if(cashe.isOnce){
        this.event.delete(name);
      }
      cashe.fn(data);
    }
  }
}
```
- 手写数组排序（sort）、数组去重（deduplicate）、数组拉平（flat）
```js
// 快速排序
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

// 去重
const deduplicate = (arr)=>{
  return [...new Set(arr)];
}
// 拉平
const myFlat = (list,res)=>{
  for(let item of list){
    if(Array.isArray(item)){
      res.concat(myFlat(item,res));
    }else{
      res.push(item);
    }
  }
}
```
- 手写深拷贝（deepClone）
```js
// 方法一
JSON.parse(JSON.stringify())
//方法二：
const deepClone = (target)=>{
  if(typeof target === 'object'){
    const obj = Array.isArray(target)?[]:{};
    for(let item in target){
      if(obj.hasOwnProperty(item)){
        obj[item] = deepClone(target(item));
      }
    }
  }else{
    return target;
  }
}
```
- 手写jsonp
```js
/**
 * 
 * @param {*} options 
 * https://github.com/webmodules/jsonp/blob/master/index.js
 */
function myJsonp(options) {
	return new Promise((resolve, reject) => {
		//判断是否是第一次jsonp请求
		if (!window.jsonpNum) {
			window.jsonpNum = 1
		} else {
			window.jsonpNum++
		}

		let {					
			url,
			data,
			timeout = 5000,
			cbkey = 'callback',
		} = options
        
		//保证每次请求接收的方法都不会重复
		let funName = 'jsonpReceive' + window.jsonpNum
        
		//清除本次jsonp请求产生的一些无用东西
		function clear() { 							
			window[funName] = null
			script.parentNode.removeChild(script);
			clearTimeout(timer)
		}
		
		//定义jsonp接收函数
		window[funName] = function(res) {
		//一旦函数执行了，就等于说请求成功了
			resolve(res) 							
			clear()
		}
		
		//请求超时计时器
		let timer = setTimeout(() => {				
			reject('超时了')
			clear()
		}, timeout)
		
		//定义请求的参数
		let params = '' 								
		
		//如果有参数
		if (Object.keys(data).length) { 			
			for (let key in data) {
				params += `&${key}=${encodeURIComponent(data[key])}`;
			}
			
			params = params.substr(1)
		}
		
		//拼接最终的请求路径，结尾拼接回调的方法名
		url = url + '?' + params + `&${cbkey}=${funName}`  	

		let script = document.createElement('script');
		script.src = url;
		document.body.appendChild(script);
	})
}

```
- 手写proxy
```js
const myProxy = (obj,handler)=>{
  const _target = JSON.parse(JSON.stringify(obj));
  Object.keys(_target).forEach(key=>{
    Object.defineProperties(_target,key,{
      get:()=>handler.get && handler.get(obj,key),
      set:newValue=>handler.set && handler.set(obj,key,newValue)
    })
  })
  return _target;
}
```
- 手写setInterval、setTimeout
```js
const mySetInterval=(cb,delay)=>{
  const context =this;
  const timer = setTimeout(()=>{
    cb.call(context);
    clearTimeout(timer);
    mySetInterval(cb,delay)
  },delay);
}
```
- 手写webpack
```js

```