// let age = 0
// console.log(`I am ${age} years old.`)


// let student = {name:'tom' , grade: 85 , ispassed: true}
// console.log(student)

// const readline = require('readline');
// let rl = readline.createInterface({
//     input : process.stdin , 
//     output : process.stdout
// });
// rl.question('' , (answer) => {
//     let arr = answer.trim().split(' ');
//     if(arr.length == 0){
//         rl.close();
//         return;
//     }
//     const [a , b] = arr;
//     let x = Number(a)*Number(b);
//     console.log(`...${x}`);
//     rl.close();
// });

// const readline = require('readline');
// let rl = readline.createInterface({
//     input : process.stdin,
//     output : process.stdout
// })
// rl.question('' , (test) =>{
//     let arr = test.trim().split(' ');
//     for(let i = 0 ; i < arr.length ; i++){
//         switch(arr[i]){
//             case 0:
//                 console.log(0);
//             case 1:
//                 console.log(1);
//             case 2:
//                 console.log(2);
//             default:
//                 console.log(test)
//         }
//     }
//     rl.close();  
// });

// function fib(n){
//     if (n == 0) return 0;
//     if (n == 1) return 1;
//     return fib(n-1) + fib(n-2);
// }
// function main(){
//     const readline = require("readline");
//     let rl = readline.createInterface({
//         input : process.stdin,
//         output : process.stdout
//     });
//     rl.question('',(n) => {
//         console.log(fib(n));
//         rl.close();
//     });
// }
// main()

// try{
//     let x = y +1;
// }catch(e){
//     console.log(e.message);
// }finally{
//     console.log(111)
// // }

// let nums = [1 , 2 , 3 , 4];
// let nums_1 = nums.map(x => x**2);
// console.log(nums , nums_1);
// let nums_2 = nums.filter(x => x % 2 == 0);
// console.log(nums , nums_2);
// nums.forEach(x => console.log(x))

const print = (input) => {
    console.log(input);
    return;
}
const checkHonor = (passed_students , out_students) => {
    for(let i = 0 ; i < passed_students.length ; i++){
        if(passed_students[i][1] >= 90){
            out_students[i] += '- honor';
        }
    }
    return;
}
const checkrange = (check_score) =>{
    if(check_score > 100 || check_score < 0){
        throw new Error("ValueError");
    }
}
const readline = require('readline');
let rl = readline.createInterface({
    input : process.stdin,
    output : process.stdout
});
let students = [];
const readInput = () => {
        rl.question('' , (data) => {
        if(!data) {
            rl.close();
            return;
        }
        try{
            const [name , score] = data.trim().split(' ');
            checkrange(Number(score));
            students.push([name , Number(score)]);
        }catch(e){
            print(e);
            return;
        }
        readInput();
    });
}
readInput();
rl.on('close' , () => {
    if (students.length == 0) return;
    const passed_students = students.filter((x) => x[1] >= 60);
    const out_students = passed_students.map((x) => `${x[0]} passed with ${x[1]}`);
    checkHonor(passed_students , out_students);
    out_students.forEach(x => print(x));
});