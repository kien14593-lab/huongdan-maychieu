# Hướng dẫn xử lý sự cố máy chiếu – Phân hiệu Trường ĐH GTVT tại TP. Hồ Chí Minh

Website **tĩnh** (HTML/CSS/JS thuần, không cần build, không dùng CDN – chạy được offline) giúp giảng viên
tự khắc phục **tạm thời** các sự cố máy chiếu thường gặp ngay tại lớp bằng điện thoại, và biết khi nào
cần dừng lại để gọi IT.

Máy chiếu được đề cập: **Hitachi** (Maxell), **Sony**, **Infoto** (máy chiếu tương tác – tài liệu chỉ hướng dẫn dùng
để trình chiếu, không đề cập chức năng viết/chạm) và nhóm **hãng khác** (NEC, Epson, ViewSonic, Eiki – vài phòng, dùng
chung hướng dẫn). Các model cùng hãng vận hành giống nhau nên hướng dẫn **không tách theo model**; danh sách
**phòng → hãng máy** lấy từ biên bản kiểm tra máy chiếu ngày 11/07 (58 phòng) và nằm trong `config.js`.
Tất cả phòng dùng cáp **HDMI**.
Máy chiếu đều **treo trên cao** nên hướng dẫn chỉ gồm các thao tác giảng viên làm được từ dưới: remote, đầu cáp
ở bàn giảng viên / ổ trên tường, công tắc điện của phòng và laptop. Việc trên thân máy (nút bấm, dây nguồn, ống kính,
khe gió, lọc bụi) được ghi rõ là do IT thực hiện. Remote hết pin: giảng viên tự lấy pin dự phòng ở **phòng nước
giảng viên** (vị trí cụ thể sửa bằng khóa `noi_lay_pin` trong `config.js`).

## Cấu trúc thư mục

```
index.html            Trang chủ: quy trình 4 bước (đến phòng → bật máy → cắm HDMI → gặp sự cố), ô gõ số phòng → biết hãng máy,
                      thẻ chọn hãng theo remote (đen = Hitachi, trắng mỏng dẹp = Sony, trắng dày = Infoto, + hãng khác)
                      → chuyển sang trang sự cố; hộp liên hệ IT (cuối trang)
su-co.html            8 sự cố (accordion) xếp thành 1 danh sách duy nhất theo 4 thời điểm trong lớp: lúc bật máy → lúc cắm HDMI
                      → hình đã lên nhưng chưa đúng → đang dạy bỗng mất hình / máy tắt. Mỗi sự cố: dấu hiệu → các bước
                      → KHÔNG NÊN → khi nào gọi IT. Nhận tham số `?may=hitachi|sony|infoto|khac` và/hoặc `?phong=203E7`
                      để hiện banner hãng đã chọn
hitachi.html          Hướng dẫn theo hãng: ảnh remote thật + sơ đồ nút tô màu, chọn HDMI, đèn báo, tắt máy đúng cách,
sony.html             danh sách phòng dùng hãng đó (Hitachi R017H · Sony RM-PJ8 · Infoto – remote bố cục Sanyo MXBT)
infoto.html
ket-noi-laptop.html   Windows 10/11 (Win + P, Presenter View), macOS (adapter, Mirror), sai tỉ lệ hình
lien-he.html          Khi nào gọi IT ngay, thông tin liên hệ, mẫu báo sự cố có nút "Sao chép mẫu" (gõ phòng → tự chọn hãng)
assets/css/style.css  Toàn bộ giao diện (mobile-first, chữ to, nút ≥ 48px, có CSS in ấn)
assets/js/config.js   ★ NƠI DUY NHẤT CẦN SỬA khi có thông tin thật (số IT, danh sách phòng → hãng máy…)
assets/js/main.js     Chèn cấu hình, danh sách phòng, accordion, chọn hãng (?may=), sao chép mẫu, nút in
assets/img/           Ảnh remote thật (remote-*.jpg), sơ đồ remote vẽ theo bố cục thật (remote-*.svg), sơ đồ minh họa khác
.nojekyll             Để GitHub Pages phục vụ file tĩnh nguyên trạng
```

## Điền thông tin thật (placeholder)

Mở `assets/js/config.js`, sửa giá trị bên phải dấu `:` rồi lưu. Không cần sửa file HTML.

| Khóa trong `config.js`  | Giá trị hiện tại       | Ví dụ giá trị thật                         | Xuất hiện ở đâu                                    |
|-------------------------|------------------------|--------------------------------------------|----------------------------------------------------|
| `sdt_it`                | `[SỐ ĐIỆN THOẠI IT]`   | `"028 3899 1234"`                          | Nút Gọi IT (tự tạo link `tel:`), chân trang        |
| `zalo_it`               | `[ZALO IT]`            | `"0901 234 567 (Zalo Phòng IT)"`           | Hộp liên hệ trang chủ và trang Liên hệ             |
| `zalo_url`              | `""` (trống)           | `"https://zalo.me/0901234567"`             | Liên kết "(mở Zalo)" – chỉ hiện khi có URL         |
| `phong_it`              | `[PHÒNG IT]`           | `"Phòng A1.05, tầng 1 nhà A1"`             | Hộp liên hệ                                        |
| `gio_ho_tro`            | `[GIỜ HỖ TRỢ]`         | `"7:00–17:00, Thứ 2 – Thứ 7"`              | Hộp liên hệ                                        |
| `model_hitachi`, `model_sony`, `model_infoto`, `model_khac` | (đã điền theo biên bản 11/07) | `"EX250, RX250, …"` | Một dòng nhỏ "IT tham khảo" trên trang hãng |
| `nguon_phong`           | `"biên bản kiểm tra máy chiếu ngày 11/07"` | `"biên bản kiểm tra 01/2027"` | Kèm danh sách phòng (trang chủ, trang hãng) |
| `phong`                 | 58 phòng (đã điền)     | `"203E7": "hitachi"`                       | Ô gõ số phòng (trang chủ), số/danh sách phòng trên thẻ hãng, banner trang Sự cố, mẫu báo sự cố |
| `noi_lay_pin`           | `"phòng nước giảng viên"` (đã điền) | `"phòng nước giảng viên (tầng 2 nhà A1)"` | Mục 1 & 2 trang Sự cố, 3 trang hãng, trang Liên hệ |
| `ten_truong`, `ten_truong_ngan` | (đã điền)      | –                                          | Đầu trang, chân trang                              |
| `cap_nhat`              | `"09/2026"`            | `"01/2027"`                                | Chân trang                                         |

Cách hoạt động: các phần tử HTML có thuộc tính `data-config="tên_khóa"` sẽ được JS thay nội dung bằng giá trị
trong `CONFIG`. Trong HTML vẫn có sẵn chữ dự phòng (chính là placeholder) nên nếu JS không chạy trang vẫn đọc được.
Giá trị còn dạng `[...]` được tô vàng nhẹ để dễ nhận ra chỗ chưa điền.

### Danh sách phòng → hãng máy chiếu (`CONFIG.phong`)

Mỗi dòng có dạng `"SỐ PHÒNG": "hãng"` với hãng là `hitachi`, `sony`, `infoto`, `nec`, `epson`, `viewsonic` hoặc `eiki`
(chữ thường). Hãng ngoài ba hãng chính được gom vào nhóm **"khác"** trên web. Khi đổi máy chỉ cần sửa hãng của phòng đó;
thêm phòng mới thì thêm một dòng. JS tự cập nhật: ô gõ số phòng (chấp nhận gõ thường, có khoảng trắng, `dn` thay `ĐN`),
số phòng và danh sách phòng trên thẻ hãng, banner ở trang Sự cố, và tự chọn hãng trong mẫu báo sự cố.
Danh sách phòng ghi sẵn trong HTML (chữ dự phòng khi không có JS) nên sau khi sửa `config.js` nhiều, nên cập nhật lại
các đoạn `data-phong-list` trong `index.html`, `su-co.html` và 3 trang hãng cho khớp (không bắt buộc).

### Ảnh remote và sơ đồ nút

Ảnh remote thật của 3 hãng nằm trong `assets/img/` và dùng chung cho thẻ chọn hãng (trang chủ), banner trang Sự cố và
trang hãng. Muốn thay bằng ảnh chụp của trường: chụp remote trên nền sáng, cắt sát thân remote, lưu đè cùng tên file
(giữ tỉ lệ dọc) hoặc sửa `src` của các thẻ `<img>` tương ứng. Các file hiện có:

- `remote-hitachi.jpg` (Hitachi R017H, đen), `remote-sony.jpg` (Sony RM-PJ8, trắng mỏng), `remote-infoto.jpg`
  (remote đi kèm máy Infoto, trắng dày, bố cục giống Sanyo MXBT) – ảnh chụp thật, đã cắt.
- `remote-hitachi.svg`, `remote-sony.svg`, `remote-infoto.svg` – sơ đồ vẽ theo đúng bố cục các remote trên, tô màu 3 nhóm
  nút cần nhớ (đỏ/xanh lá: bật tắt · xanh đậm: chọn HDMI · vàng: dễ bấm nhầm). Nếu trường đổi remote, sửa lại tên nút
  trong 3 trang hãng, banner `su-co.html` và vẽ lại sơ đồ (hoặc bỏ hình sơ đồ, chỉ giữ ảnh chụp).
- `remote-mini-khac.svg` – biểu tượng remote chung cho nhóm "Hãng khác".
- `ket-noi.svg`, `win-p.svg`, `logo.svg` – sơ đồ minh họa khác.

Cách nhận biết hãng theo remote (đen / trắng mỏng / trắng dày) ghi trong `index.html` và `su-co.html`.
Nên dùng ảnh JPG/PNG đã nén (≤ 300 KB) để tải nhanh trên điện thoại. Nhớ cập nhật `alt` mô tả ảnh.

### Sửa nội dung hướng dẫn

Nội dung nằm trực tiếp trong các file `.html`. Mỗi sự cố trong `su-co.html` là một khối `<article class="acc" id="...">`
với 4 phần cố định. Khi thêm sự cố mới:

1. Sao chép một khối `<article class="acc">`, đổi `id` (dùng chữ không dấu, nối bằng `-`) và các `id` con (`-btn`, `-panel`),
   đặt vào đúng khối thời điểm (`<section class="stage-block">` tương ứng) và đánh lại số thứ tự trong tiêu đề nếu cần.
   Dòng `acc__sub` là mô tả ngắn hiện ngay dưới tiêu đề khi accordion đang đóng – viết 1 câu, dễ nhận ra.
2. Tùy chọn: thêm mục tương ứng vào danh sách "Triệu chứng" trong `lien-he.html`.

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

- Tạo QR từ đường dẫn trang chủ (hoặc thẳng đến trang sự cố của hãng máy trong phòng, ví dụ
  `.../su-co.html?may=hitachi`, hoặc một sự cố cụ thể `.../su-co.html#no-signal`) bằng công cụ tạo QR
  bất kỳ; in cỡ tối thiểu 5 × 5 cm kèm dòng chữ *"Máy chiếu gặp sự cố? Quét mã để xem hướng dẫn – IT: [số]"*.
- Dán gần bàn giảng viên / cạnh ổ cắm HDMI, ép plastic để bền.
- Có thể in luôn trang `su-co.html` (nút **🖨️ In**, hoặc Ctrl + P): CSS in ấn đã ẩn điều hướng và mở toàn bộ
  các mục, phù hợp để dán tại phòng.

## Kỹ thuật

- HTML5 ngữ nghĩa, accordion có `aria-expanded` / `aria-controls`, focus nhìn thấy rõ, vùng chạm ≥ 44 px.
- Không JavaScript vẫn đọc được toàn bộ nội dung (accordion mở sẵn, các chip chọn hãng ẩn).
- Font hệ thống, không tải tài nguyên ngoài, tổng dung lượng nhỏ – phù hợp mạng 4G yếu.
- CSS `@media print` cho bản in dán phòng.
