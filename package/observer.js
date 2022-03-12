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