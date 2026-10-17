# Vietnam Lunar – Lịch Âm Việt Nam cho KDE Plasma 6

Widget đồng hồ cho KDE Plasma 6 hiển thị **âm lịch Việt Nam** (múi giờ UTC+7).

Plasma mặc định chỉ có lịch âm Trung Quốc (UTC+8), nên có ngày Tết và ngày mùng 1, rằm lệch so với Việt Nam trong một số năm. Widget này tính âm lịch theo giờ Việt Nam.

## Tính năng

- Panel hiển thị giờ và ngày dương lịch như đồng hồ thường.
- Bấm vào để mở lịch tháng, mỗi ô có số ngày âm lịch. Mùng 1 hiện dạng `ngày/tháng`.
- Tô màu mùng 1 và ngày rằm.
- Can Chi của năm và của ngày.
- Đánh dấu ngày lễ âm lịch (rê chuột để xem tên): Tết Nguyên Đán, Rằm tháng Giêng, Giỗ Tổ Hùng Vương, Phật Đản, Đoan Ngọ, Vu Lan, Trung Thu, ông Táo chầu trời.
- Hỗ trợ tháng nhuận.
- Nút chuyển tháng và nút "Hôm nay".

## Cài đặt

Yêu cầu: KDE Plasma 6.

```bash
git clone https://github.com/bangbuiduc/vietnam-lunar.git
cd vietnam-lunar
mkdir -p ~/.local/share/plasma/plasmoids
cp -r net.bangbd.vnlunar ~/.local/share/plasma/plasmoids/
```

Hoặc dùng `kpackagetool6`:

```bash
kpackagetool6 --type Plasma/Applet --install net.bangbd.vnlunar
```

Sau đó: chuột phải vào panel, chọn *Enter Edit Mode*, *Add Widgets*, tìm **"Lịch Âm Việt Nam"** và kéo vào panel. Có thể gỡ đồng hồ mặc định nếu không cần.

Nếu widget không hiện, chạy `plasmashell --replace &` để khởi động lại Plasma.

## Gỡ cài đặt

```bash
rm -rf ~/.local/share/plasma/plasmoids/net.bangbd.vnlunar
```

## Cấu trúc

```
net.bangbd.vnlunar/
├── metadata.json
└── contents/ui/
    ├── main.qml    # giao diện panel và popup lịch
    └── lunar.js    # thuật toán âm lịch
```

## Thuật toán

Dựa trên thuật toán của Hồ Ngọc Đức (tính giờ sóc và tiết khí theo múi giờ UTC+7). Đã đối chiếu: Tết 2024 (10/2), Tết 2025 (29/1), Tết 2026 (17/2) và tháng 2 nhuận năm 2023.

## Giấy phép

GPL-2.0-or-later.
