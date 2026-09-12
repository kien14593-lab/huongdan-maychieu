/* =====================================================================
   CẤU HÌNH NỘI DUNG – ĐÂY LÀ FILE DUY NHẤT CẦN SỬA KHI CÓ THÔNG TIN THẬT
   ---------------------------------------------------------------------
   - Sửa giá trị trong dấu ngoặc kép, giữ nguyên tên khóa (bên trái dấu :).
   - Giá trị còn để dạng [TRONG NGOẶC VUÔNG] là placeholder chưa điền;
     trang web sẽ tự tô vàng nhẹ các chỗ này để dễ nhận ra.
   - Sau khi sửa, lưu file và tải lại trang (Ctrl + F5) để xem kết quả.
   - Các vị trí hiển thị trong HTML được đánh dấu bằng data-config="tên_khóa".
     Nếu JavaScript không chạy, trang vẫn hiển thị chữ dự phòng có sẵn trong HTML.
   ===================================================================== */
window.CONFIG = {
  /* Tên trường (đầy đủ và rút gọn) */
  ten_truong: "Phân hiệu Trường Đại học Giao thông Vận tải tại TP. Hồ Chí Minh",
  ten_truong_ngan: "Phân hiệu Trường ĐH GTVT tại TP. Hồ Chí Minh",

  /* Liên hệ bộ phận IT / Quản trị thiết bị
     - sdt_it: số gọi trực tiếp. Ví dụ: "028 3899 1234" hoặc "0901 234 567".
       Nút "Gọi IT" sẽ tự tạo liên kết tel: từ các chữ số của giá trị này.
     - zalo_it: tên/số Zalo hiển thị. Ví dụ: "0901 234 567 (Zalo: Phòng IT)".
     - zalo_url: đường dẫn mở Zalo, để trống "" nếu chưa có.
       Ví dụ: "https://zalo.me/0901234567".
     - phong_it: vị trí phòng. Ví dụ: "Phòng A1.05, tầng 1 nhà A1".
     - gio_ho_tro: khung giờ trực. Ví dụ: "7:00–17:00, Thứ 2 – Thứ 7". */
  sdt_it: "[SỐ ĐIỆN THOẠI IT]",
  zalo_it: "[ZALO IT]",
  zalo_url: "",
  phong_it: "[PHÒNG IT]",
  gio_ho_tro: "[GIỜ HỖ TRỢ]",

  /* Model máy chiếu đang dùng (có thể ghi nhiều model, cách nhau bằng dấu phẩy).
     Ví dụ: "CP-EX303, CP-X4042WN". */
  model_hitachi: "[MODEL]",
  model_sony: "[MODEL]",
  model_infoto: "[MODEL]",

  /* Tên phần mềm bảng trắng / tương tác đi kèm máy chiếu Infoto.
     Ví dụ: "Infoto Board" hoặc "IQBoard". */
  phan_mem_tuong_tac: "[PHẦN MỀM TƯƠNG TÁC]",

  /* Thời điểm cập nhật nội dung (hiển thị ở chân trang) */
  cap_nhat: "09/2026"
};
