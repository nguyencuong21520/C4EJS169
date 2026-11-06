// let fruit = ["apple", "banana", "orange"];

// fruit[fruit.length] = "mango";
// fruit.push("strawberry", "aa", "sssss");

// console.log(fruit);

// let num = [1, 2, 3, 4];
// => [2,4,6,8]

// let newNum = [];
// for (let i = 0; i < num.length; i++) {
//   newNum.push(num[i] * 2);
// }

// console.log(newNum);

// let newNum2 = num.map((currentValue, index) => {
//   return currentValue * index;
// });

// console.log(newNum2);

// let fruit = ["apple", "banana", "orange", "grape"];
// ["tôi ăn", "tôi ăn", "tôi ăn", "tôi ăn"]

// let result = fruit.map(() => {
//   return `Tôi ăn`;
// });

// console.log(result);

// let num = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// let result = num.filter((value, index, array) => {
//   return value % 2 == 0;
// });

// console.log(result);

// const numbers = [5, 12, 8, 130, 44];
// const found = numbers.find((currentValue, index, array) => {
//   return currentValue > 10;
// });

// console.log(found);

// let student = [
//   { name: "John", score: 7 },
//   { name: "Alice", score: 9 },
//   { name: "Tom", score: 8 },
// ];
// // in ra tên của sinh viên đầu tiên có điểm > 8

// const foundStudent = student.find((student) => {
//   return student.score > 8;
// });

// console.log(foundStudent.name);

// const numbers = [1, 2, 3, 4, 5];

// [1,2,3,"alo","bye",5]
// numbers.splice(3, 0, "alo", "bye");

//[0,1,2,3,4,5]
// numbers.splice(0, 0, 0);

//[1,"xx",4,5]
// numbers.splice(1, 2, "xx");

// console.log(numbers);

// const obj = { a: 1, b: 2, c: { d: 4, e: 5 } };

// let keyList = Object.keys(obj);
// console.log(keyList);

// let valueList = Object.values(obj);
// console.log(valueList);

let a = {
  name: "NVC",
  age: 20,
  address: "Ha Noi",
  fb: "XXX",
  ag,
};

let b = { ...a, fb: "XXX", age: 30 };
// {
//   name: "NVC",
//   age: 20,
//   address: "Ha Noi",
// };

a.name = "alo";

console.log("a sau", a);
console.log("b sau", b);

const arr1 = [1, 2, 3];
const arr2 = [...arr1]; // đưa các phần tử của mảng arr1 vào mảng arr2

console.log(arr2);

const obj1 = { name: "Alice", age: 25 };
const obj2 = { job: "Developer" };
const obj3 = { ...obj1, ...obj2 };

console.log(obj3);
