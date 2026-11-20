// class Student{
//     constructor(name , score){
//         this.name = name;
//         this.score = score;
//     }
//     passOrFail(){
//         if (this.score >= 60)return"passed";
//         return"failed";
//     }
//     static createStudent(str){
//         const [name, score] = str.trim().split(' ');
//         if(Number(score) > 100 || Number(score) < 0 || isNaN(Number(score)))return;
//         return new Student(name, Number(score));
//     }
// }
// const s = Student.createStudent("Amy 95");
// console.log(s.passOrFail());

class Book{
    constructor(title , author , year){
        this.title = title;
        this.author = author;
        this.year = year;
    }
    isOld = () => {
        if(this.year < 2005) return true;
        return false;
    }
    summary = () => {
        process.stdout.write(`<${this.title}> by ${this.author} (${this.year})`);
        return
    }
}
function main(){
    let arr = [];
    const readline = require('readline');
    let rl = readline.createInterface({
            input:process.stdin,
            output:process.stdout
        });
    const check = (year) => {
        if(year > 2025){
            console.log('invalid');
            return true;
        }
        if(isNaN(year)){
            console.log('invalidnumber');
            return true;
        }
        return false;
    }
    const readInput = () => {
        rl.question('start:' , (data) => {
            if(data.length == 0){
                rl.close();
                return;
            }
            arr.push(data);
            readInput();
        });
    }
    readInput();
    rl.on('close' , () => {
        for(let x of arr){
            let [title , author , year] = x.trim().split(';');
            const book = new Book(title , author , Number(year))
            if(check(Number(year)))continue;
            else if(book.isOld()){
                book.summary();
                process.stdout.write('- old book');
            }
            else{
                book.summary();
            }
            console.log('')
        }
    });
}
main();