class Project { 
   constructor(title) {
    this.title = title;
    this.list = [];
   } 
   
   add(item) {
    this.list.push(item);
   }

   remove(index) {
    this.list.splice(index,1);
   }

   log() {
    for(let i = 0; i < this.list.length; i++){
        this.list[i].log();
    }    
   }
}
export default Project;