# Tasks — million-hearts-landing

## Overview

Danh sách các task triển khai feature `million-hearts-landing`. Mỗi task là một đơn vị công việc có thể hoàn thành độc lập và được verify bằng acceptance criteria tương ứng.

---

## Task List

### 1. Scaffold file index.html và cấu trúc cơ bản

- [x] 1.1 Tạo file `index.html` với DOCTYPE, meta viewport, meta charset UTF-8
- [x] 1.2 Viết CSS reset và base styles (box-sizing, margin: 0, font-family system stack)
- [x] 1.3 Thêm dark gradient background toàn trang (`#0a0a0f` → `#1a0a2e`) dùng CSS background
- [x] 1.4 Tạo `<section id="intro">` căn giữa màn hình bằng CSS Flexbox (justify-content: center, align-items: center, min-height: 100vh)
- [x] 1.5 Tạo skeleton `<script>` block với EventBus implementation đơn giản (on/off/emit)
- [x] 1.6 Thêm `<canvas id="heartCanvas">` ẩn ban đầu (display: none) với z-index phù hợp

**Validates:** Requirements 1.1, 5.1, 5.3

---

### 2. Intro Section — nội dung văn bản và layout

- [x] 2.1 Thêm `<h1>` với headline "1,000,000 ❤ Trái Tim" (hoặc tương đương)
- [x] 2.2 Thêm `<p class="subheadline">` với subtext tán tỉnh hài hước kèm chú thích italic nhỏ (ví dụ: *(đã đếm kỹ, không thiếu cái nào)*)
- [x] 2.3 Thêm `<button id="trollBtn">` với nhãn ban đầu "Nhấn để xem 1,000,000 ❤"
- [x] 2.4 Style Troll_Button: padding, border-radius, gradient, hover effect cơ bản
- [x] 2.5 Thêm `<div id="trollMessage" hidden>` với nội dung hài hước ("Đấy, anh/em không nói dối nhé! 😄")
- [x] 2.6 Responsive CSS: media query `max-width: 480px` điều chỉnh font-size headline và button

**Validates:** Requirements 1.2, 1.3, 1.4, 1.5, 5.5

---

### 3. ParticlePool — TypedArrays và object pooling

- [x] 3.1 Khởi tạo `MAX_PARTICLES = 1_000_000` và định nghĩa `COLOR_PALETTE` array
- [x] 3.2 Tạo ParticlePool object với SoA TypedArrays: `x, y, vx, vy, size, alpha, twinklePhase, twinkleFreq, depthLayer, colorIndex, active` (Float32Array và Uint8Array theo spec)
- [x] 3.3 Viết hàm `initParticle(index)` — assign ngẫu nhiên các thuộc tính theo depth_layer spec (size, speed ranges)
- [x] 3.4 Viết hàm `recycleParticle(index)` — reset particle về trạng thái mới (giữ nguyên array slot, thay đổi giá trị)
- [x] 3.5 Viết hàm `batchInit(startIndex, count)` — khởi tạo `count` particles bắt đầu từ `startIndex`
- [x] 3.6 Implement non-blocking batch initialization: chia 1M particles thành chunks 10.000, schedule qua `setTimeout` hoặc `requestIdleCallback`
- [x] 3.7 Thêm canvas fallback: kiểm tra `canvas.getContext('2d')` và hiển thị `<div id="fallback">` nếu không hỗ trợ

**Validates:** Requirements 2.1, 2.2, 2.5, 2.6, 3.7

---

### 4. CanvasRenderer — Animation loop và rendering

- [x] 4.1 Viết hàm `initCanvas()` — lấy 2D context, set canvas size theo viewport
- [x] 4.2 Viết hàm `drawBackground()` — vẽ dark gradient (#0a0a0f → #1a0a2e) mỗi frame
- [x] 4.3 Viết hàm `updateParticles(timestamp)` — cập nhật vị trí (x += vx, y += vy), cập nhật twinklePhase
- [x] 4.4 Viết hàm `computeAlpha(particle_index)` — `0.35 + 0.65 * (0.5 + 0.5 * Math.sin(twinklePhase[i]))` để alpha ∈ [0.3, 1.0]
- [x] 4.5 Viết hàm `drawParticles()` — batch render tất cả active particles dùng `ctx.fillText("❤", x, y)` hoặc canvas path
- [x] 4.6 Implement recycling trong update loop: nếu particle ra ngoài viewport hoặc alpha ≤ 0 → gọi `recycleParticle(index)`
- [x] 4.7 Viết `animationLoop(timestamp)` — clearRect, drawBackground, updateParticles, drawParticles, drawShootingStars, requestAnimationFrame
- [x] 4.8 Viết `startLoop()` và `stopLoop()` (dùng `cancelAnimationFrame`)
- [x] 4.9 Viết `burstAt(x, y, count)` — activate `count` inactive particles gần vị trí (x, y) với vận tốc bung ra nhiều hướng
- [x] 4.10 Implement `ResizeObserver` / `window.onresize` để gọi `renderer.resize(w, h)` khi viewport thay đổi; cập nhật `canvas.width` và `canvas.height`

**Validates:** Requirements 2.1, 2.3, 2.4, 3.1, 3.7, 3.8, 5.2

---

### 5. Starfield Mode — Depth layers, twinkle, shooting stars

- [x] 5.1 Đảm bảo depth_layer 0 (xa): size 4–8px, speed multiplier 0.3–0.5
- [x] 5.2 Đảm bảo depth_layer 1 (giữa): size 9–16px, speed multiplier 0.6–0.8
- [x] 5.3 Đảm bảo depth_layer 2 (gần): size 17–28px, speed multiplier 0.9–1.5
- [x] 5.4 Apply depth-based parallax trong `updateParticles`: vx và vy nhân với `DEPTH_SPEED[depthLayer[i]]`
- [x] 5.5 Implement Twinkle_Effect: update `twinklePhase[i] += twinkleFreq[i]` mỗi frame, wrap tại 2π
- [x] 5.6 Implement Shooting_Star: tạo struct gồm 5–10 particle indices với sizes giảm dần theo hướng di chuyển
- [x] 5.7 Viết hàm `spawnShootingStar()` — chọn hướng chéo ngẫu nhiên, assign particles, set high speed (8–15 px/frame), lifetime 0.5–1s
- [x] 5.8 Viết `drawShootingStars()` trong animation loop
- [x] 5.9 Schedule shooting star spawn: `setInterval` với interval ngẫu nhiên trong [3000ms, 7000ms], gọi `spawnShootingStar()`
- [x] 5.10 Set màu particle từ COLOR_PALETTE: `['#ffffff', '#ffb3c6', '#ff6b9d', '#ffd700']`

**Validates:** Requirements 3.2, 3.3, 3.4, 3.5, 3.6, 3.8

---

### 6. TrollButton — State machine

- [x] 6.1 Khởi tạo TrollButton state: `{ state: 'idle', trollCounter: 0, threshold: random [3,5], messageIndex: 0 }`
- [x] 6.2 Bind `mouseover` event listener lên `#trollBtn` — gọi `handleTroll()`
- [x] 6.3 Bind `touchstart` event listener lên `#trollBtn` — gọi `handleTroll()` (mobile)
- [x] 6.4 Viết `handleTroll()`: nếu `state !== 'unlocked'` → tăng `trollCounter`, đổi nhãn, tính vị trí ngẫu nhiên mới, apply CSS transform/transition
- [x] 6.5 CSS transition cho Troll_Button: `transition: all 250ms ease-in-out` để trượt mượt
- [x] 6.6 Vị trí troll: tính `top` và `left` ngẫu nhiên trong viewport bounds (`0 + margin` → `vh/vw - button_size - margin`)
- [x] 6.7 Mobile guard: giới hạn vùng di chuyển trong viewport khi `window.innerWidth < 480px`
- [x] 6.8 Đổi nhãn theo `TROLL_MESSAGES` array (luân phiên hoặc ngẫu nhiên)
- [x] 6.9 Khi `trollCounter >= threshold`: set `state = 'unlocked'`, đặt lại vị trí trung tâm, đổi nhãn thành "Được rồi, nhấn đây! 🎉"
- [x] 6.10 Hiển thị `<div id="trollHint">` ("Oke oke, anh/em thắng rồi 😅") trong 2 giây khi unlock
- [x] 6.11 Bind `click` event listener: chỉ emit `heart_explosion` nếu `state === 'unlocked'`; nếu không → gọi `handleTroll()` thêm một lần

**Validates:** Requirements 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8

---

### 7. Counter — easeOutQuad animation

- [x] 7.1 Viết hàm `easeOutQuad(t)` — `return t * (2 - t)`
- [x] 7.2 Viết hàm `getCounterValue(elapsed, duration)` — `return Math.floor(easeOutQuad(elapsed/duration) * 1_000_000)`
- [x] 7.3 Viết hàm `formatCounter(n)` — định dạng số với dấu phân cách hàng nghìn (dùng `Intl.NumberFormat` hoặc regex)
- [x] 7.4 Tạo `<div id="counter" hidden>` trong HTML để hiển thị số đếm
- [x] 7.5 Viết `startCounter(duration)` — lưu `startTime = performance.now()`, chạy `requestAnimationFrame` riêng để update `#counter` element
- [x] 7.6 Khi `elapsed >= duration` hoặc counter = 1,000,000: dừng counter loop, emit `counter_complete`
- [x] 7.7 Khi `counter_complete`: hiển thị `#trollMessage`

**Validates:** Requirements 4.1, 4.2, 4.3, 4.4

---

### 8. CatDance — CSS animation + BPM sync

- [x] 8.1 Tạo `<div id="catDance" hidden>` ở góc dưới màn hình (position: fixed, bottom: 16px, right: 16px)
- [x] 8.2 Nội dung Cat_Dance: emoji `🐱` với các emoji phụ (♪ ❤ ✨) trong span riêng
- [x] 8.3 Viết CSS keyframe animation `@keyframes catBounce` — bounce/wiggle
- [x] 8.4 Viết CSS keyframe animation `@keyframes catSlideIn` — slide in từ dưới lên (translateY từ 100px → 0)
- [x] 8.5 Viết CSS keyframe animation `@keyframes catCelebrate` — spin nhanh hơn
- [x] 8.6 Max-size CSS: `max-width: 80px; max-height: 80px` desktop; `max-width: 60px; max-height: 60px` tại `max-width: 480px`
- [x] 8.7 Viết `syncBPM(bpm)` — set `catDance.style.animationDuration = (60000 / bpm) + 'ms'`
- [x] 8.8 Viết `catSlideIn()` — set `hidden = false`, add class `slide-in`
- [x] 8.9 Viết `catCelebrate()` — swap animation class sang `celebrate`; sau 3 giây, `fadeOut()`
- [x] 8.10 Bind click event trên `#catDance` → gọi `renderer.burstAt(catX, catY, 50)` (easter egg)

**Validates:** Requirements 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7

---

### 9. MusicPlayer — HTMLAudioElement + localStorage

- [x] 9.1 Nhúng file nhạc dưới dạng `<audio id="bgMusic" loop>` với `src` là base64 data URI hoặc đường dẫn local (ví dụ: `music.mp3` hoặc inline base64)
- [x] 9.2 Tạo `<button id="musicToggle">🔊</button>` ở góc trên màn hình (position: fixed, top: 16px, right: 16px), luôn visible
- [x] 9.3 Viết `MusicPlayer.loadState()` — đọc `localStorage.getItem('mhl_music_on')`, set `isPlaying` state
- [x] 9.4 Viết `MusicPlayer.saveState()` — gọi sau mỗi toggle để persist vào localStorage
- [x] 9.5 Viết `MusicPlayer.play()` — gọi `audio.play()`, wrap trong try/catch để handle autoplay rejection
- [x] 9.6 Khi `audio.play()` bị reject: hiển thị `<div id="musicPrompt">🎵 Nhấn để bật nhạc</div>`, ẩn sau user interaction
- [x] 9.7 Viết `MusicPlayer.toggle()` — chuyển isPlaying, gọi play/pause, cập nhật icon toggle (🔊/🔇), gọi saveState
- [x] 9.8 Viết `MusicPlayer.syncCatDance(catDance)` — sau play, gọi `catDance.syncBPM(120)`

**Validates:** Requirements 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7

---

### 10. App Orchestrator — kết nối các modules

- [x] 10.1 Viết `App.init()` — khởi tạo tất cả modules, gọi `trollButton.init()`, `musicPlayer.loadState()`
- [x] 10.2 Subscribe `EventBus.on('heart_explosion', onHeartExplosion)`
- [x] 10.3 Viết `onHeartExplosion()`:
  - Ẩn `#intro` section (fade out hoặc `display: none`)
  - Hiển thị `#heartCanvas` và `#counter`
  - Scroll mượt đến canvas nếu cần: `canvas.scrollIntoView({ behavior: 'smooth' })`
  - Gọi `renderer.activateStarfieldMode()`
  - Gọi `counter.startCounter(randomDuration)` với duration ngẫu nhiên [3000, 8000]
  - Gọi `musicPlayer.play()`
  - Gọi `catDance.slideIn()`
- [x] 10.4 Subscribe `EventBus.on('counter_complete', onCounterComplete)` → gọi `catDance.celebrate()`, show `#trollMessage`
- [x] 10.5 Bind `canvas.addEventListener('click', onCanvasClick)` và `canvas.addEventListener('touchend', onCanvasClick)` → `renderer.burstAt(x, y, 100)`
- [x] 10.6 Kiểm tra canvas fallback trong App.init(): nếu không hỗ trợ Canvas → hiển thị `#fallback`, không khởi động modules khác

**Validates:** Requirements 9.1, 9.2, 9.3, 9.4

---

### 11. Property-Based Tests (fast-check)

- [x] 11.1 Setup test environment: tạo file `tests/` (hoặc `test/`) với Vitest config, cài fast-check
- [x] 11.2 **P1 — Particle Invariants**: `fc.record({ depthLayer: fc.integer({min:0,max:2}), ... })` → verify tất cả field ranges
  ```
  // Feature: million-hearts-landing, Property 1: Particle Invariants
  ```
- [x] 11.3 **P2 — Twinkle Alpha Range**: `fc.float({ min: 0, max: 2*Math.PI })` → verify alpha ∈ [0.3, 1.0]
  ```
  // Feature: million-hearts-landing, Property 2: Twinkle Alpha Range
  ```
- [x] 11.4 **P3 — Shooting Star Particle Count**: `fc.record({ direction, speed })` → verify 5–10 particles, decreasing sizes
  ```
  // Feature: million-hearts-landing, Property 3: Shooting Star Particle Count
  ```
- [x] 11.5 **P4 — Pool Size Invariant**: Arbitrary sequence of particle out-of-bounds/zero-alpha events → pool size constant
  ```
  // Feature: million-hearts-landing, Property 4: Particle Pool Size Invariant
  ```
- [x] 11.6 **P5 — Counter Monotonicity**: `fc.integer({ min: 3000, max: 8000 })` as duration → check monotonicity and completion
  ```
  // Feature: million-hearts-landing, Property 5: Counter Monotonicity and Completion
  ```
- [x] 11.7 **P6 — Counter Formatting**: `fc.integer({ min: 0, max: 1_000_000 })` → verify thousand separators correct
  ```
  // Feature: million-hearts-landing, Property 6: Counter Thousand-Separator Formatting
  ```
- [x] 11.8 **P7 — Canvas Resize**: `fc.tuple(fc.integer({min:1}), fc.integer({min:1}))` → canvas.width/height match
  ```
  // Feature: million-hearts-landing, Property 7: Canvas Resize Matches Viewport
  ```
- [x] 11.9 **P8 — Troll Counter Increment**: `fc.integer({ min: 1, max: 5 })` as k hovers → counter = k
  ```
  // Feature: million-hearts-landing, Property 8: Troll Counter Increment Invariant
  ```
- [x] 11.10 **P9 — Troll Label From Set**: Arbitrary troll event → label ∈ TROLL_MESSAGES
  ```
  // Feature: million-hearts-landing, Property 9: Troll Label From Predefined Set
  ```
- [x] 11.11 **P10 — BPM to Duration**: `fc.integer({ min: 1, max: 300 })` as BPM → animationDuration = 60000/BPM
  ```
  // Feature: million-hearts-landing, Property 10: BPM to Animation Duration Mapping
  ```
- [x] 11.12 **P11 — Music localStorage Persistence**: Arbitrary toggle sequence → localStorage matches state after each toggle
  ```
  // Feature: million-hearts-landing, Property 11: Music State localStorage Persistence
  ```

**Validates:** Design Correctness Properties 1–11

---

### 12. Responsive Design và Polish

- [x] 12.1 Verify media query `max-width: 480px`: font-size headline, button size
- [x] 12.2 Troll_Button mobile bounds: giới hạn `top/left` trong `[0, window.innerHeight - btnH]` và `[0, window.innerWidth - btnW]`
- [x] 12.3 Test trên viewport 375px (iPhone SE) — headline readable, button không tràn
- [x] 12.4 Test trên viewport 1920px — canvas full width, intro centered
- [x] 12.5 Verify không có external CDN links, external scripts, external fonts (kiểm tra bằng DevTools Network tab)
- [x] 12.6 Verify `requestAnimationFrame` polyfill `setTimeout(fn, 16)` tồn tại như fallback
- [x] 12.7 Verify `localStorage` try/catch wrapper để không crash trong Safari private mode
- [x] 12.8 Performance smoke test: mở trang trên Chrome, confirm 60 FPS trong DevTools Performance panel sau khi Starfield_Mode active

**Validates:** Requirements 1.1, 5.4, 5.5, 5.6

---

## Dependency Graph

```
Task 1 (Scaffold)
  └─> Task 2 (Intro Section)
  └─> Task 3 (ParticlePool)
        └─> Task 4 (CanvasRenderer)
              └─> Task 5 (Starfield Mode)
Task 6 (TrollButton) [sau Task 2]
Task 7 (Counter) [independent]
Task 8 (CatDance) [independent]
Task 9 (MusicPlayer) [independent]
Task 10 (App Orchestrator) [sau Tasks 3–9]
Task 11 (PBT) [sau Tasks 3–9]
Task 12 (Polish) [sau Task 10]
```

---

## Definition of Done

- [x] Tất cả acceptance criteria trong requirements.md được cover bởi ít nhất một task
- [x] Tất cả property-based tests pass (≥100 iterations mỗi test)
- [x] Trang load được trên Chrome, Firefox, Safari (desktop và mobile)
- [x] Không có external dependencies (verified bằng Network tab)
- [x] Performance: ≥30 FPS khi Starfield_Mode active với 1M particles trên mid-range device
- [x] localStorage state persistence hoạt động sau reload
