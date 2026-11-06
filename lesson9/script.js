// let thinh_name = "Nguyễn Văn Thịnh";
// let thinh_age = 20;
// let thinh_address = "Hà Nội";

// let thinh_ = ["Nguyễn Văn Thịnh", 20, "Hà Nội"];

// let thinh = {
//   name: "Nguyễn Văn Thịnh",
//   age: 20,
//   address: {
//     city: "Hà Nội",
//     country: "Việt Nam",
//   },
//   isMarried: true,
//   hobbies: ["Nghe nhạc", "Đọc sách", "Chơi game"],
// };

// Tạo Object
// - dùng ngoặc nhọn ({})
// - key: value
// - ngăn cách các cặp key-value bởi dấu phẩy (,)

//Bài tập
// tạo 1 object lưu thông tin chi tết về bản thân mình

// let student = [
//   {
//     name: "Thịnh",
//     age: 18,
//     address: "Thái Bình",
//     isMarried: false,
//     hobbies: ["Đọc sách", "Bơi lội", "Chơi game"],
//   },
//   {
//     name: "Quyên",
//     age: 17,
//     address: "Hà Nội",
//     isMarried: false,
//     hobbies: ["Đọc sách", "Bơi lội", "Chơi game"],
//   },
//   {
//     name: "Tiến",
//     age: 19,
//     address: "Hải Phòng",
//     isMarried: false,
//     hobbies: ["Nghe nhạc", "Đọc sách", "Chơi game"],
//   },
// ];

//Đọc
// let thinh = {
//   name: "Nguyễn Văn Thịnh",
//   age: 20,
//   address: {
//     city: "Hà Nội",
//     country: "Việt Nam",
//     postCode: {
//       code: 10000,
//       lat: [21],
//       lng: [105],
//     },
//   },
//   isMarried: true,
//   hobbies: ["Nghe nhạc", { name: "Đọc sách", level: "high" }, [1, 2, 3, 4, 5]],
// };

// high
// 4
// 21
// console.log("trước", thinh);
// thinh.name = "Nguyễn Văn Cường";

//delete

// delete thinh.isMarried;
// delete thinh.hobbies;

// for (let alo in thinh) {
//   console.log(alo);
// }

// techProducts[i].price > 500;
// log ra

const techProducts = [
  {
    name: "Laptop Dell XPS 13",
    price: 1500,
    description:
      "Laptop mỏng nhẹ với màn hình 13.4 inch, vi xử lý Intel Core i7 thế hệ 11 và ổ cứng SSD 512GB.",
    quantity: 10,
  },
  {
    name: "Apple iPhone 13 Pro",
    price: 1200,
    description:
      "Điện thoại iPhone 13 Pro với màn hình Super Retina XDR 6.1 inch, chip A15 Bionic và hệ thống camera ba ống kính.",
    quantity: 25,
  },
  {
    name: "Tai nghe Sony WH-1000XM4",
    price: 350,
    description:
      "Tai nghe chống ồn chủ động cao cấp từ Sony, với thời lượng pin lên đến 30 giờ và khả năng kết nối không dây Bluetooth.",
    quantity: 15,
  },
  {
    name: "Apple Watch Series 7",
    price: 500,
    description:
      "Đồng hồ thông minh với màn hình lớn hơn, chống nước và theo dõi sức khỏe toàn diện.",
    quantity: 30,
  },
  {
    name: "Máy tính bảng Samsung Galaxy Tab S7",
    price: 700,
    description:
      "Máy tính bảng với màn hình 11 inch, hỗ trợ bút S Pen, chạy hệ điều hành Android 11.",
    quantity: 20,
  },
  {
    name: "Loa thông minh Google Nest Audio",
    price: 100,
    description:
      "Loa thông minh tích hợp trợ lý ảo Google Assistant, âm thanh sống động và kết nối với hệ thống nhà thông minh.",
    quantity: 50,
  },
  {
    name: "Camera GoPro HERO9",
    price: 450,
    description:
      "Camera hành trình GoPro HERO9 với khả năng quay video 5K, chống nước và ổn định hình ảnh mạnh mẽ.",
    quantity: 12,
  },
  {
    name: "Bàn phím cơ Keychron K2",
    price: 80,
    description:
      "Bàn phím cơ không dây với layout 75%, hỗ trợ kết nối đa thiết bị và các phím chuyển đổi Mac/Windows.",
    quantity: 40,
  },
];

// for (let i = 0; i < techProducts.length; i++) {
//   if (techProducts[i].price > 500) {
//     console.log(techProducts[i].name);
//   }
// }

// duplicatesArray

// arr = [5, 3, 2, 3, 1, 4, 3, 1];
// => sort : [1,1,2,3,3,3,4,5]
// => removeDuplicates : [1,2,3,4,5]

// let arr = [5, 3, 2, 3, 1, 4, 3, 1];

//sort
// for (let i = 0; i < arr.length; i++) {
//   for (let j = i + 1; j < arr.length; j++) {
//     if (arr[i] > arr[j]) {
//       let temp = arr[i];
//       arr[i] = arr[j];
//       arr[j] = temp;
//     }
//   }
// }
// let result = [];

// removeDuplicate
// for (let i = 0; i < arr.length; i++) {
//   for (let j = i + 1; j < arr.length; j++) {
//     if (arr[i] === arr[j]) {
//       result[result.length] = arr[i];
//       break;
//     }
//   }
// }

// console.log(result);

// let car = { brand: "Toyota", model: "Camry", year: 2020 };
// let count = 0;
// for (let i in car) {
//   //   console.log(i);

//   count++;
// }

// console.log(count);

// let product = { name: "Laptop", price: 1000 };
//output
// [["name", "Laptop"], ["price", 1000]]

// let result = [];

// for (let i in product) {
//   result.push([i, product[i]]);
// }

const person = {
  name: "John",
  age: 30,
  job: "Developer",
};

person.address = "Hà Nội";

console.log(person);
