// function tinhChuVi(chieurong, chieucao) {
//   //logic here
//   let chuVi = (chieurong + chieucao) * 2;
//   return chuVi;
// }

// let chuViHinh1 = tinhChuVi(20, 10);
// let chuViHinh2 = tinhChuVi(200, 5000);

function cacCongViecBuoiSang(thu, gio) {
  console.log(`Thứ ${thu}`);
  console.log(`Thức dậy lúc ${gio} sáng`);
  console.log("Ăn sáng");
}

// cacCongViecBuoiSang(2, 6);
// cacCongViecBuoiSang(3, 7);

function demTu1denN() {
  for (let i = 1; i <= 10; i++) {
    console.log(i);
  }
}

// demTu1denN();
// demTu1denN();

// function dienTich(dai, rong) {
//   let dienTich = dai * rong;
//   return dienTich;
// }

// let dienTich2 = (dai, rong) => {
//   let dienTich = dai * rong;
//   return dienTich;
// };

// let dienTich3 = (dai, rong) => dai * rong;

// let giaTien = dienTich(5, 3) * 5000;
// console.log(giaTien);

// const isPositive = (num) => (num > 0 ? "Positive" : "Non-positive");

// function isPostive1(num) {
//   if (num > 0) {
//     return "Positive";
//   } else {
//     return "Non-positive";
//   }
// }

let sum = (x, y, ...a) => {
  //a = [1,2,3,4]
  console.log("a", a);
  let tong = 0;
  for (let i = 0; i < a.length; i++) {
    tong = tong + a[i];
  }
  return tong;
};

console.log(sum(1, 2, 3, 4, 5));

const x = () => {
  console.log("xxx");
};

console.log("x", x());

const kien = () => {
  let xx = 5;

  console.log("xx", xx);
};

kien();
