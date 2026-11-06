
// - Create
// let names = ["Alice", "Bob", "Charlie", "David"];
// const classes = ["11A2", "11A3", "11A4", "11A5"];
// var fruits = ["apple", "banana", "cherry","orange","pineapple","mango","strawberry","watermelon","pineapple","mango","strawberry","watermelon"];

// let luckyNumber = [1, 6,8];

// let anything = [1, "hello", true, null, undefined, [1, 2, 3]];



// Read

// console.log(names)
// console.log(names[3])
// console.log(fruits[fruits.length - 1])

// console.log(fruits)

// in ra toàn bộ danh sách trong mảng fruits
// console.log(names[0])
// console.log(fruits[1])
// console.log(fruits[2])
// console.log(fruits[3])
// console.log(fruits[4])
// console.log(fruits[5])
// console.log(fruits[6])
// console.log(fruits[7])
// console.log(fruits[9])

// for(let i = 0; i < fruits.length; i++){
//     console.log(fruits[i])
// }





// -> Xin chào Alice ạ
// -> Xin chào Bob ạ
// -> Xin chào Charlie ạ
// -> Xin chào David ạ




// const names = ["Alice", "Bob", "Charlie", "David", "Eve"];
// //"Alice", "Bob", "Charlie", "MindX", "David", "Eve"


// const newValue = 'MindX';
// const insertIndex = 3;

// // thực hiện dịch chuyển từ vị trí cuối cùng của mảng tới vị trí cần chèn
// for (let i = names.length - 1; i >= insertIndex; i--) {
//     names[i + 1] = names[i];
// }
// console.log(names); // ['Alice', 'Bob', 'Charlie', 'David', 'David', 'Eve']
// // thực hiện gán lại giá trị
// names[insertIndex] = newValue;
// console.log(names); // ['Alice', 'Bob', 'Charlie', 'MindX', 'David', 'Eve']



// const names = ["Alice", "Bob", "Charlie", "David", "Eve"];

// const deleteIndex= 2;

// // duyệt từ vị trí xoá
// for (let i = deleteIndex; i < names.length - 1; i++) {
//   names[i] = names[i + 1]; // Dịch chuyển các phần tử về phía trước
// }
// // giảm kích thước mảng
// names.length = names.length - 1;
// console.log(names); // ["Alice", "Bob", "David", "Eve"]


//Search

const names = ["Alice", "Bob", "Charlie", "David", "Eve"];

let searchKey = "Charlie"

for(let i = 0; i < names.length; i++){
    if(names[i] === searchKey){
        console.log(`Tìm thấy ${searchKey} rồi`)
        break
    }
    console.log(i)
}