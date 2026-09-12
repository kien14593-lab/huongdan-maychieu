# Hướng dẫn xử lý sự cố máy chiếu – Phân hiệu Trường ĐH GTVT tại TP. Hồ Chí Minh

Website **tĩnh** (HTML/CSS/JS thuần, không cần build, không dùng CDN – chạy được offline) giúp giảng viên
tự khắc phục **tạm thời** các sự cố máy chiếu thường gặp ngay tại lớp bằng điện thoại, và biết khi nào
cần dừng lại để gọi IT.

Máy chiếu được đề cập: **Hitachi** (Maxell), **Sony**, **Infoto** (máy chiếu tương tác). Tất cả phòng dùng cáp **HDMI**.
Máy chiếu đều **treo trên cao** nên hướng dẫn chỉ gồm các thao tác giảng viên làm được từ dưới: remote, đầu cáp
ở bàn giảng viên / ổ trên tường, công tắc điện của phòng và laptop. Việc trên thân máy (nút bấm, dây nguồn, ống kính,
khe gió, lọc bụi) được ghi rõ là do IT thực hiện.

## Cấu trúc thư mục

```
index.html            Trang chủ: Gọi IT, tìm nhanh triệu chứng, lưới thẻ, link hãng, checklist 60 giây
su-co.html            10 sự cố theo triệu chứng (accordion): dấu hiệu → các bước → KHÔNG NÊN → khi nào gọi IT
hitachi.html          Hướng dẫn theo hãng: nút remote, chọn HDMI, đèn báo, tắt máy đúng cách
sony.html
infoto.html           + phần riêng về chức năng tương tác (USB, hiệu chỉnh, bút, phần mềm bảng trắng)
ket-noi-laptop.html   Windows 10/11 (Win + P, Presenter View), macOS (adapter, Mirror), sai tỉ lệ hình
lien-he.html          Khi nào gọi IT ngay, thông tin liên hệ, mẫu báo sự cố có nút "Sao chép mẫu"
assets/css/style.css  Toàn bộ giao diện (mobile-first, chữ to, nút ≥ 48px, có CSS in ấn)
assets/js/config.js   ★ NƠI DUY NHẤT CẦN SỬA khi có thông tin thật (số IT, model máy…)
assets/js/main.js     Chèn cấu hình, accordion, tìm nhanh, sao chép mẫu, nút in
assets/img/*.svg      Ảnh minh họa tự vẽ (remote, sơ đồ) – thay bằng ảnh thật khi có
.nojekyll             Để GitHub Pages phục vụ file tĩnh nguyên trạng
```

## Điền thông tin thật (placeholder)

Mở `assets/js/config.js`, sửa giá trị bên phải dấu `:` rồi lưu. Không cần sửa file HTML.

| Khóa trong `config.js`  | Placeholder hiện tại   | Ví dụ giá trị thật                         | Xuất hiện ở đâu                                    |
|-------------------------|------------------------|--------------------------------------------|----------------------------------------------------|
| `sdt_it`                | `[SỐ ĐIỆN THOẠI IT]`   | `"028 3899 1234"`                          | Nút Gọi IT (tự tạo link `tel:`), chân trang, checklist |
| `zalo_it`               | `[ZALO IT]`            | `"0901 234 567 (Zalo Phòng IT)"`           | Hộp liên hệ trang chủ và trang Liên hệ             |
| `zalo_url`              | `""` (trống)           | `"https://zalo.me/0901234567"`             | Liên kết "(mở Zalo)" – chỉ hiện khi có URL         |
| `phong_it`              | `[PHÒNG IT]`           | `"Phòng A1.05, tầng 1 nhà A1"`             | Hộp liên hệ                                        |
| `gio_ho_tro`            | `[GIỜ HỖ TRỢ]`         | `"7:00–17:00, Thứ 2 – Thứ 7"`              | Hộp liên hệ                                        |
| `model_hitachi`         | `[MODEL]`              | `"CP-EX303"`                               | Trang chủ, trang Hitachi                           |
| `model_sony`            | `[MODEL]`              | `"VPL-EX575"`                              | Trang chủ, trang Sony                              |
| `model_infoto`          | `[MODEL]`              | `"IF-…"`                                   | Trang chủ, trang Infoto                            |
| `phan_mem_tuong_tac`    | `[PHẦN MỀM TƯƠNG TÁC]` | `"Infoto Board"`                           | Trang Infoto, mục 10 trang Sự cố                   |
| `ten_truong`, `ten_truong_ngan` | (đã điền)      | –                                          | Đầu trang, chân trang                              |
| `cap_nhat`              | `"09/2026"`            | `"01/2027"`                                | Chân trang                                         |

Cách hoạt động: các phần tử HTML có thuộc tính `data-config="tên_khóa"` sẽ được JS thay nội dung bằng giá trị
trong `CONFIG`. Trong HTML vẫn có sẵn chữ dự phòng (chính là placeholder) nên nếu JS không chạy trang vẫn đọc được.
Giá trị còn dạng `[...]` được tô vàng nhẹ để dễ nhận ra chỗ chưa điền.

### Thay ảnh minh họa bằng ảnh thật

Chụp ảnh remote, ổ cắm HDMI/USB trên bàn giảng viên hoặc tường của từng phòng rồi lưu vào `assets/img/` và sửa thuộc tính `src`
của thẻ `<img>` tương ứng trong trang hãng (`hitachi.html`, `sony.html`, `infoto.html`). Các file hiện có:

- `remote-hitachi.svg`, `remote-sony.svg`, `remote-infoto.svg` – sơ đồ remote
- `placeholder-photo.svg` – khung "chỗ chèn ảnh thật"
- `so-do-infoto.svg`, `ket-noi.svg`, `win-p.svg`, `logo.svg` – sơ đồ minh họa khác

Nên dùng ảnh JPG/PNG đã nén (≤ 300 KB) để tải nhanh trên điện thoại. Nhớ cập nhật `alt` mô tả ảnh.

### Sửa nội dung hướng dẫn

Nội dung nằm trực tiếp trong các file `.html`. Mỗi sự cố trong `su-co.html` là một khối `<article class="acc" id="...">`
với 4 phần cố định. Khi thêm sự cố mới:

1. Sao chép một khối `<article class="acc">`, đổi `id` (dùng chữ không dấu, nối bằng `-`) và các `id` con (`-btn`, `-panel`).
2. Thêm dòng vào danh sách "Danh sách sự cố" đầu trang `su-co.html`.
3. Thêm thẻ vào lưới triệu chứng trong `index.html` (điền `data-keywords` để tìm nhanh) và tùy chọn vào danh sách
   "Triệu chứng" trong `lien-he.html`.

## Chạy thử trên máy

Cần Python (có sẵn trên macOS, cài từ python.org trên Windows):

```bash
cd huongdan-maychieu
python -m http.server 8000
```

Mở trình duyệt vào <http://localhost:8000>. Để xem trên điện thoại cùng mạng Wi-Fi, dùng địa chỉ IP của máy tính
(ví dụ `http://192.168.1.10:8000`). Cũng có thể mở thẳng file `index.html` bằng trình duyệt (double-click) –
mọi tính năng vẫn hoạt động.

## Đưa lên GitHub Pages

1. Đẩy toàn bộ repo lên GitHub (nhánh `main`).
2. Vào **Settings → Pages**.
3. Mục **Build and deployment** → Source: **Deploy from a branch** → Branch: **main**, thư mục **/ (root)** → **Save**.
4. Sau 1–2 phút, trang có tại `https://<tên-tài-khoản>.github.io/<tên-repo>/`.

File `.nojekyll` đã có sẵn để GitHub không xử lý qua Jekyll. Mọi liên kết trong site là đường dẫn tương đối nên
cũng chạy được khi đặt trong thư mục con hoặc trên máy chủ nội bộ của trường.

## Gợi ý mã QR dán tại phòng học

- Tạo QR từ đường dẫn trang chủ (hoặc thẳng đến một sự cố, ví dụ `.../su-co.html#no-signal`) bằng công cụ tạo QR
  bất kỳ; in cỡ tối thiểu 5 × 5 cm kèm dòng chữ *"Máy chiếu gặp sự cố? Quét mã để xem hướng dẫn – IT: [số]"*.
- Dán gần bàn giảng viên / cạnh ổ cắm HDMI, ép plastic để bền.
- Có thể in luôn trang `su-co.html` (nút **In trang này**, hoặc Ctrl + P): CSS in ấn đã ẩn điều hướng và mở toàn bộ
  các mục, phù hợp để dán tại phòng.

## Kỹ thuật

- HTML5 ngữ nghĩa, accordion có `aria-expanded` / `aria-controls`, focus nhìn thấy rõ, vùng chạm ≥ 44 px.
- Không JavaScript vẫn đọc được toàn bộ nội dung (accordion mở sẵn, ô tìm nhanh ẩn).
- Font hệ thống, không tải tài nguyên ngoài, tổng dung lượng nhỏ – phù hợp mạng 4G yếu.
- CSS `@media print` cho bản in dán phòng.
