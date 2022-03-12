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
