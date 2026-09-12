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

  /* Model máy chiếu theo hãng – CHỈ ĐỂ IT THAM KHẢO (hiển thị một dòng nhỏ trên trang hãng).
     Các model cùng hãng vận hành giống nhau nên hướng dẫn không tách theo model.
     Theo biên bản kiểm tra máy chiếu ngày 11/07. */
  model_hitachi: "EX250, RX250, EX252, 3051WN",
  model_sony: "VPL-EX570 (đa số), VPL-CH370",
  model_infoto: "Infoto 112",
  model_khac: "NEC ME403UG, Epson X51, ViewSonic (chiếu gần), Eiki",

  /* Nguồn của danh sách phòng bên dưới (hiển thị kèm danh sách) */
  nguon_phong: "biên bản kiểm tra máy chiếu ngày 11/07",

  /* DANH SÁCH PHÒNG → HÃNG MÁY CHIẾU
     Thầy cô gõ số phòng ở trang chủ để biết ngay loại máy chiếu trong phòng.
     - Mỗi dòng: "SỐ PHÒNG": "hãng"  (hãng viết chữ thường, không dấu:
       hitachi | sony | infoto | nec | epson | viewsonic | eiki).
     - Hãng ngoài hitachi / sony / infoto được gom vào nhóm "khác" trên web.
     - Khi đổi máy: sửa hãng của phòng đó; thêm phòng mới thì thêm một dòng
       (nhớ dấu phẩy cuối dòng). Số phòng ghi liền, chữ in, ví dụ "203E7", "301ĐN". */
  phong: {
    /* Nhà C2 */
    "101C2": "nec",
    "103C2": "sony",
    "104C2": "viewsonic",
    "201C2": "infoto",
    "202C2": "sony",
    "203C2": "infoto",
    "301C2": "infoto",
    "302C2": "infoto",
    "303C2": "infoto",
    "304C2": "sony",
    "401C2": "infoto",
    "402C2": "infoto",
    "403C2": "infoto",
    "404C2": "hitachi",
    "501C2": "sony",
    "502C2": "sony",
    "503C2": "epson",
    "504C2": "sony",
    /* Nhà E3 */
    "P1E3": "hitachi",
    "P2E3": "nec",
    "P3E3": "infoto",
    "P4E3": "infoto",
    /* Nhà E4 */
    "P1E4": "nec",
    "P2E4": "sony",
    "P3E4": "sony",
    /* Nhà E5 */
    "P1E5": "sony",
    "P2E5": "sony",
    "P3E5": "nec",
    "P4E5": "sony",
    /* Nhà ĐN */
    "201ĐN": "infoto",
    "202ĐN": "infoto",
    "203ĐN": "infoto",
    "204ĐN": "infoto",
    "301ĐN": "infoto",
    "302ĐN": "infoto",
    "303ĐN": "nec",
    "304ĐN": "infoto",
    "401ĐN": "infoto",
    "402ĐN": "infoto",
    "403ĐN": "infoto",
    "404ĐN": "infoto",
    "501ĐN": "infoto",
    "502ĐN": "infoto",
    "503ĐN": "nec",
    "504ĐN": "infoto",
    /* Nhà E6 */
    "P1E6": "sony",
    "P2E6": "hitachi",
    "P3E6": "sony",
    "P4E6": "sony",
    /* Nhà E7 */
    "106E7": "hitachi",
    "202E7": "sony",
    "203E7": "hitachi",
    "204E7": "hitachi",
    "205E7": "hitachi",
    "206E7": "hitachi",
    /* Nhà E9 */
    "P1E9": "hitachi",
    "P3E9": "eiki",
    "P4E9": "sony"
  },

  /* Nơi để pin dự phòng cho remote – thầy cô tự đến lấy, không cần gọi IT.
     Có thể ghi thêm vị trí cụ thể. Ví dụ: "phòng nước giảng viên (tầng 2 nhà A1)". */
  noi_lay_pin: "phòng nước giảng viên",

  /* Thời điểm cập nhật nội dung (hiển thị ở chân trang) */
  cap_nhat: "09/2026"
};
