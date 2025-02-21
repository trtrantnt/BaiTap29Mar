let Student = function(name,age,score1,score2){
    this.name = name;
    this.age = age,
    this.scores = {
        score1: score1,
        score2 : score2
    },
    this.getInfo = function(){
        return `Ten: ${this.name} Tuoi: ${this.age} DiemSo1: ${this.scores.score1} DiemSo2: ${this.scores.score2}`
    }
}
let student2 = new Student("Toan",17,2,2);
let student1 = new Student("Tung",16,8,6);
let student3 = new Student("Tuan",18,3,4);
let student4 = new Student("Tien",19,2,9.5);