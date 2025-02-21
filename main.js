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


const student2 = new Student("Toan",17,2,2);
let student1 = new Student("Tung",16,8,9);
let student3 = new Student("Tuan",18,3,4);
let student4 = new Student("Tien",19,2,9.5);
Student.prototype.phone = "0987654321"
let students = [student1,student2,student3,student4];

//In ra 1 mang la xep loai cua moi sv
// let result = [];
// for (const student of students) {
//     if(student.scores.score1+student.scores.score2>=16){
//         result.push("gioi");
//     }else{
//         if(student.scores.score1+student.scores.score2>=13){
//             result.push("Kha");
//         }else{
//             if(student.scores.score1+student.scores.score2>=10){
//                 result.push("TB");
//             }else{
//                 result.push("yeu");
//             }
//         }
//     }
// }

let result = students.map(
    function(student){
        if(student.scores.score1+student.scores.score2>=16){
           return "Gioi";
        }else{
            if(student.scores.score1+student.scores.score2>=13){
                return "Kha";
            }else{
                if(student.scores.score1+student.scores.score2>=10){
                    return "TB";
                }else{
                    return "yeu";
                }
            }
        }
    }
)

// let sum = 0;
// for (const student of students) {
//     sum+=student.age;
// }

let sum = students.reduce(function(sum,student){
    return sum+=student.age;
},0)

//lay ra tat ca cac sinh vien >=18 tuoi
//let Tren18Tuoi = [];
// for (const student of students) {
//     if(student.age>=18){
//         Tren18Tuoi.push(student);
//     }
// } 
let Tren18Tuoi=students.filter(function(student){
    return student.scores.score1+student.scores.score2>=16;
})
//check ca lop deu dat hsg
let checkHSG = students.every(function(student){
    return student.scores.score1+student.scores.score2<16;
})
let checkTonTaiHSG = students.some(function(student){
    return student.scores.score1+student.scores.score2<16;
})
students.sort();
function Compare(a,b){
    if(a.age==b.age){
        return (a.scores.score1+a.scores.score2)-(b.scores.score1+b.scores.score2)
    }
    return a.age-b.age;
}
// Tung ? Toan ->6
// Toan? Tung ->-6
// a ? b -> x
// b ? a -> -x