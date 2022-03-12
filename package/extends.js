function Parent(){
  this.name='jack';
}
function Child(){
  this.age=10;
  Parent.call(this);
}

const a = new Child()
console.log(a)