# Requirements Document

## Introduction

Landing page đơn (single-page) viết bằng HTML + Vanilla JavaScript, không dùng framework. Trang hiển thị 1 triệu trái tim với animation mượt mà, lấy cảm hứng từ câu hứa hẹn tán tỉnh "tặng 1 triệu trái tim". Tone trang: nhẹ nhàng lãng mạn nhưng có chút hài hước/troll. Kỹ thuật tối ưu bằng Canvas hoặc DOM batching để đảm bảo hiệu năng khi xử lý số lượng lớn phần tử.

## Glossary

- **Page**: Toàn bộ landing page single-page (file `index.html`).
- **Heart**: Biểu tượng trái tim (❤ hoặc ký tự tương đương), đơn vị cơ bản được generate và animate.
- **Canvas_Renderer**: Module JavaScript sử dụng HTML5 Canvas API để vẽ và animate hàng triệu Heart.
- **Counter**: Thành phần UI hiển thị số lượng Heart đang được hiển thị, đếm tăng dần từ 0 đến 1.000.000.
- **Intro_Section**: Phần đầu trang chứa headline, subheadline và nút call-to-action.
- **Heart_Explosion**: Hiệu ứng tất cả Heart bùng nổ/xuất hiện sau khi người dùng nhấn nút CTA thành công.
- **Troll_Message**: Dòng chú thích hài hước/troll xuất hiện sau khi hoàn tất hiển thị 1 triệu Heart.
- **Particle**: Một Heart đơn lẻ trong hệ thống Canvas, có vị trí (x, y), vận tốc, kích thước, màu sắc, độ mờ, và các thuộc tính Starfield (twinkle_phase, depth_layer).
- **Animation_Loop**: Vòng lặp `requestAnimationFrame` chịu trách nhiệm cập nhật và vẽ lại toàn bộ Particle mỗi frame.
- **Troll_Button**: Nút CTA có hành vi troll — di chuyển, thu nhỏ, đổi nhãn để tránh né người dùng trong một số lần nhất định trước khi cho phép nhấn thật.
- **Troll_Counter**: Biến đếm nội bộ theo dõi số lần Troll_Button đã troll người dùng trong một phiên.
- **Cat_Dance**: Nhân vật mèo hoạt hình (CSS animation + emoji/ASCII art) xuất hiện và nhảy múa sau khi Heart_Explosion được kích hoạt thành công.
- **Music_Player**: Module JavaScript quản lý phát nhạc nền, hỗ trợ toggle bật/tắt và loop.
- **Starfield_Mode**: Chế độ hiển thị Heart mô phỏng bầu trời đêm đầy sao tim — Hearts lấp lánh, có độ sâu parallax và hiệu ứng shooting star.
- **Shooting_Star**: Hiệu ứng một vệt Heart bay nhanh theo đường chéo qua màn hình, xuất hiện ngẫu nhiên trong Starfield_Mode.
- **Twinkle_Effect**: Hiệu ứng Heart nhấp nháy sáng/tối ngẫu nhiên, mô phỏng ánh sáng lấp lánh của sao.
- **Depth_Layer**: Thuộc tính của Particle xác định lớp độ sâu (gần/xa) để tạo hiệu ứng parallax — Particle ở lớp gần lớn hơn và di chuyển nhanh hơn.

---

## Requirements

### Requirement 1: Cấu trúc trang và nội dung văn bản

**User Story:** As a người xem, I want thấy một trang web với nội dung hấp dẫn và đúng tone tán tỉnh hài hước, so that tôi hiểu ý nghĩa và bối cảnh của 1 triệu trái tim.

#### Acceptance Criteria

1. THE Page SHALL chứa duy nhất một file `index.html` tự đủ (inline CSS và JS), không phụ thuộc thư viện ngoài.
2. THE Intro_Section SHALL hiển thị headline chính với nội dung đại ý "1,000,000 Trái Tim" (hoặc tương đương tiếng Việt/emoji).
3. THE Intro_Section SHALL hiển thị một subheadline mang tone tán tỉnh nhẹ, có chú thích hài hước nhỏ (ví dụ: *"(đã đếm kỹ, không thiếu cái nào)"*).
4. THE Intro_Section SHALL chứa Troll_Button với nhãn ban đầu kêu gọi người dùng xem toàn bộ 1 triệu trái tim.
5. WHEN người dùng hoàn tất xem đủ 1 triệu Heart, THE Page SHALL hiển thị Troll_Message với nội dung hài hước (ví dụ: *"Đấy, anh/em không nói dối nhé!"*).

---

### Requirement 2: Hiệu năng sinh và hiển thị 1 triệu trái tim

**User Story:** As a người xem, I want trang web load và chạy mượt mà dù phải hiển thị 1 triệu trái tim, so that trải nghiệm không bị giật lag và vẫn đẹp mắt.

#### Acceptance Criteria

1. THE Canvas_Renderer SHALL sử dụng HTML5 Canvas API để render tất cả Heart, thay vì tạo DOM node riêng lẻ cho từng Heart.
2. THE Canvas_Renderer SHALL khởi tạo tối đa 1.000.000 Particle, mỗi Particle có các thuộc tính: vị trí (x, y), vận tốc (vx, vy), kích thước (size), màu sắc (color), độ mờ (alpha), twinkle_phase, và depth_layer.
3. THE Animation_Loop SHALL sử dụng `requestAnimationFrame` để cập nhật và vẽ lại toàn bộ Particle.
4. WHILE Animation_Loop đang chạy, THE Canvas_Renderer SHALL clear canvas và redraw toàn bộ Particle active mỗi frame mà không gây memory leak.
5. THE Canvas_Renderer SHALL chia việc khởi tạo 1.000.000 Particle thành các batch nhỏ (ví dụ: 10.000 Particle/batch) được xử lý qua `setTimeout` hoặc `requestIdleCallback` để không block main thread.
6. IF thiết bị không hỗ trợ Canvas API, THEN THE Page SHALL hiển thị thông báo fallback thân thiện thay vì màn hình trống.

---

### Requirement 3: Animation Heart Sky — Bầu trời đêm lung linh

**User Story:** As a người xem, I want những trái tim hiển thị như một bầu trời đêm lung linh với hiệu ứng sao lấp lánh, độ sâu parallax và shooting star, so that trang trông huyền ảo và không nhàm chán.

#### Acceptance Criteria

1. WHEN Heart_Explosion được kích hoạt, THE Canvas_Renderer SHALL chuyển sang Starfield_Mode và render Hearts trên nền gradient tối từ đen sâu (#0a0a0f) lên tím/xanh đêm (#1a0a2e hoặc tương đương).
2. THE Canvas_Renderer SHALL gán depth_layer ngẫu nhiên cho mỗi Particle trong 3 lớp: lớp xa (size 4–8px, tốc độ chậm), lớp giữa (size 9–16px, tốc độ trung bình), lớp gần (size 17–28px, tốc độ nhanh).
3. THE Canvas_Renderer SHALL animate twinkle_phase của mỗi Particle độc lập theo hàm sin với tần số ngẫu nhiên, khiến alpha dao động trong khoảng [0.3, 1.0] để tạo Twinkle_Effect.
4. THE Canvas_Renderer SHALL gán màu sắc cho Particle trong dải trắng/hồng/đỏ/vàng sáng (ví dụ: white, #ffb3c6, #ff6b9d, #ffd700) để mô phỏng sao tim nhiều màu.
5. WHEN Starfield_Mode đang chạy, THE Canvas_Renderer SHALL sinh một Shooting_Star ngẫu nhiên trung bình mỗi 3–7 giây, với vệt Heart bay nhanh theo hướng chéo qua màn hình trong khoảng 0.5–1 giây.
6. THE Canvas_Renderer SHALL render Shooting_Star bằng một chuỗi 5–10 Heart nhỏ dần theo hướng di chuyển, tạo hiệu ứng vệt sao băng.
7. WHEN một Particle đã ra ngoài viewport hoặc alpha <= 0, THE Canvas_Renderer SHALL tái sử dụng (recycle) Particle đó thay vì xóa và tạo mới để tránh garbage collection.
8. THE Canvas_Renderer SHALL render mỗi Heart bằng ký tự Unicode "❤" hoặc vẽ hình trái tim bằng Canvas path.

---

### Requirement 4: Counter đếm trái tim

**User Story:** As a người xem, I want thấy con số đếm tăng dần lên 1.000.000, so that tôi cảm nhận được "sự chân thành" của lời hứa và có hiệu ứng ấn tượng.

#### Acceptance Criteria

1. WHEN Heart_Explosion bắt đầu, THE Counter SHALL bắt đầu đếm từ 0 và tăng dần đến 1.000.000.
2. THE Counter SHALL hiển thị số có dấu phân cách hàng nghìn (ví dụ: "1,000,000" hoặc "1.000.000").
3. THE Counter SHALL hoàn thành đếm đến 1.000.000 trong khoảng thời gian từ 3 đến 8 giây.
4. WHEN Counter đạt 1.000.000, THE Page SHALL hiển thị Troll_Message và kết thúc animation đếm.

---

### Requirement 5: Thiết kế giao diện và responsive

**User Story:** As a người xem trên điện thoại hoặc máy tính, I want trang hiển thị đúng và đẹp trên mọi kích thước màn hình, so that trải nghiệm nhất quán trên mọi thiết bị.

#### Acceptance Criteria

1. THE Page SHALL sử dụng nền tối (dark background — gradient đen-tím, ví dụ: từ #0a0a0f đến #1a0a2e) để làm nổi bật Heart màu sáng trong Starfield_Mode.
2. THE Canvas_Renderer SHALL resize Canvas theo kích thước viewport khi trang tải và khi cửa sổ thay đổi kích thước.
3. THE Intro_Section SHALL được căn giữa màn hình theo cả chiều ngang và chiều dọc sử dụng CSS Flexbox.
4. THE Page SHALL sử dụng font hệ thống (system font stack) hoặc Google Fonts để đảm bảo chữ đẹp trên mọi thiết bị mà không tải thêm file JS.
5. WHERE màn hình có chiều rộng nhỏ hơn 480px, THE Page SHALL điều chỉnh font size của headline và Troll_Button để phù hợp màn hình nhỏ.
6. WHERE màn hình có chiều rộng nhỏ hơn 480px, THE Troll_Button SHALL giới hạn vùng di chuyển trong phạm vi viewport để tránh tràn ra ngoài màn hình khi thực hiện troll.

---

### Requirement 6: Troll Button — Nút CTA troll người dùng

**User Story:** As a người xem, I want nút CTA làm khó tôi một cách hài hước trước khi cho phép nhấn thật, so that trải nghiệm vui vẻ và đáng nhớ thay vì chỉ là click đơn thuần.

#### Acceptance Criteria

1. THE Troll_Button SHALL khởi tạo với Troll_Counter = 0 và ngưỡng troll là một giá trị ngẫu nhiên trong khoảng [3, 5] lần.
2. WHEN người dùng di chuột (hover) vào Troll_Button và Troll_Counter chưa đạt ngưỡng, THE Troll_Button SHALL di chuyển đến một vị trí ngẫu nhiên khác trong viewport và tăng Troll_Counter lên 1.
3. WHEN Troll_Button di chuyển, THE Page SHALL thay đổi nhãn của Troll_Button thành một trong các thông điệp hài hước luân phiên (ví dụ: "Không phải đây!", "Gần rồi!", "Thử lại nào~", "Hehe 😏").
4. WHEN Troll_Button di chuyển, THE Page SHALL áp dụng CSS transition để nút trượt mượt đến vị trí mới trong khoảng 200–300ms.
5. WHERE thiết bị là touch screen (mobile), THE Troll_Button SHALL kích hoạt troll khi người dùng tap (touchstart) thay vì hover, và di chuyển đến vị trí mới trước khi sự kiện click được xử lý.
6. WHEN Troll_Counter đạt ngưỡng troll, THE Troll_Button SHALL trở về vị trí trung tâm, đổi nhãn thành "Được rồi, nhấn đây! 🎉" và cho phép nhấn thật sự để kích hoạt Heart_Explosion.
7. WHEN Troll_Counter đạt ngưỡng troll, THE Page SHALL hiển thị một thông điệp nhỏ bên dưới Troll_Button (ví dụ: "Oke oke, anh/em thắng rồi 😅") trong 2 giây trước khi ẩn đi.
8. IF người dùng nhấn Troll_Button trước khi Troll_Counter đạt ngưỡng (trường hợp click nhanh hơn troll), THEN THE Page SHALL không kích hoạt Heart_Explosion và Troll_Button SHALL thực hiện thêm một lần troll.

---

### Requirement 7: Cat Dance Animation

**User Story:** As a người xem, I want thấy một chú mèo đang nhảy múa vui vẻ sau khi nhấn nút thành công, so that khoảnh khắc "chiến thắng" nút troll trở nên đáng yêu và đáng nhớ hơn.

#### Acceptance Criteria

1. WHEN Heart_Explosion được kích hoạt lần đầu, THE Cat_Dance SHALL xuất hiện tại góc dưới màn hình (ví dụ: bottom-right hoặc bottom-center) với animation CSS slide-in từ dưới lên.
2. THE Cat_Dance SHALL hiển thị nhân vật mèo bằng emoji (🐱 hoặc 😺) kết hợp với các emoji phụ (♪, ❤, ✨) được hoạt hình bằng CSS keyframe animation.
3. THE Cat_Dance SHALL lặp lại animation nhảy múa (bounce, wiggle, hoặc spin) liên tục theo chu kỳ 1–2 giây trong suốt thời gian Heart_Explosion và Counter đang chạy.
4. WHEN Music_Player đang phát nhạc, THE Cat_Dance SHALL đồng bộ tốc độ animation với nhịp nhạc cố định (ví dụ: 120 BPM = animation-duration 0.5s per beat).
5. WHEN Counter đạt 1.000.000, THE Cat_Dance SHALL chuyển sang animation "celebration" (ví dụ: mèo xoay tròn nhanh hơn) trong 3 giây, sau đó fade out.
6. THE Cat_Dance SHALL có kích thước phù hợp để không che khuất Canvas hoặc Counter — tối đa 80x80px trên desktop và 60x60px trên mobile.
7. IF người dùng click vào Cat_Dance, THEN THE Page SHALL tạo thêm một burst nhỏ (~50 Heart Particle) tại vị trí Cat_Dance như một easter egg.

---

### Requirement 8: Background Music Player

**User Story:** As a người xem, I want nghe nhạc nền vui vẻ khi xem 1 triệu trái tim, so that trải nghiệm trở nên sống động và cảm xúc hơn.

#### Acceptance Criteria

1. WHEN Heart_Explosion được kích hoạt, THE Music_Player SHALL bắt đầu phát nhạc nền sau khi người dùng tương tác (để tuân thủ chính sách autoplay của trình duyệt).
2. THE Music_Player SHALL phát nhạc theo chế độ loop (lặp vô tận) cho đến khi người dùng tắt thủ công hoặc trang bị đóng.
3. THE Page SHALL hiển thị nút toggle nhạc (ví dụ: icon 🔊/🔇) ở góc trên màn hình, luôn visible trong suốt quá trình animation.
4. WHEN người dùng nhấn nút toggle nhạc, THE Music_Player SHALL chuyển đổi giữa trạng thái phát và tạm dừng.
5. THE Music_Player SHALL nhúng file nhạc dưới dạng base64 data URI hoặc tham chiếu đến file âm thanh local, không phụ thuộc CDN ngoài.
6. IF trình duyệt chặn autoplay, THEN THE Music_Player SHALL hiển thị thông báo nhỏ (ví dụ: "🎵 Nhấn để bật nhạc") và chờ tương tác người dùng trước khi phát.
7. THE Music_Player SHALL lưu trạng thái bật/tắt nhạc của người dùng vào `localStorage` để duy trì tùy chọn khi trang được reload.
8. WHEN người dùng click vào Canvas trong lúc nhạc đang phát, THE Canvas_Renderer SHALL tạo thêm một burst nhỏ (~100 Particle) tại vị trí click/tap đó, đồng bộ với nhịp âm nhạc.

---

### Requirement 9: Tương tác người dùng tổng hợp

**User Story:** As a người xem, I want có thể tương tác được với trang theo nhiều cách, so that trải nghiệm có tính chủ động và phong phú.

#### Acceptance Criteria

1. WHEN người dùng nhấn Troll_Button thành công (Troll_Counter đạt ngưỡng), THE Page SHALL ẩn Intro_Section và kích hoạt Heart_Explosion đồng thời khởi động Counter và Music_Player.
2. WHEN người dùng nhấn Troll_Button thành công, THE Page SHALL scroll mượt (smooth scroll) đến khu vực Canvas nếu Canvas nằm bên dưới fold.
3. THE Page SHALL hỗ trợ sự kiện click trên Troll_Button cho cả chuột (mouse) và touch (mobile).
4. WHEN người dùng click/tap lên Canvas trong lúc animation đang chạy, THE Canvas_Renderer SHALL tạo thêm một burst nhỏ (~100 Particle) tại vị trí click/tap đó.
