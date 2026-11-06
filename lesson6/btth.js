// Tính chu vi hình chữ nhật
let chieuDai = 50;
let chieuRong = 30;

let dienTich = chieuDai * chieuRong;
let chuVi = (chieuDai + chieuRong) * 2;

console.log(
  `Diện tích hình chữ nhật chiều dài là ${chieuDai} chiều rộng là ${chieuRong} là: ${dienTich}`,
);

console.log(`Chu Vi hình chữ nhật có chiều dài là ${chieuDai} chiều rộng là ${chieuRong} là: ${chuVi}
    `);

// --- BÀI TẬP: Đổi số giây sang Giờ - Phút - Giây ---
// Nhập số giây từ người dùng (dùng prompt hoặc gán trực tiếp giá trị)
let S = Number(prompt("Nhập vào số giây S:"));

// Tính toán theo công thức gợi ý:
let gio = (S - (S % 3600)) / 3600;
let phut = ((S % 3600) - ((S % 3600) % 60)) / 60;
let giay = S - phut * 60 - gio * 3600;

console.log(`Kết quả: ${gio} giờ ${phut} phút ${giay} giây`);
// Hoặc hiển thị dạng hh:mm:ss
console.log(`Định dạng đồng hồ: ${gio}:${phut}:${giay}`);

