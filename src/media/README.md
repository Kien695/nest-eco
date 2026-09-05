# Upload ảnh lên Cloudinary

Thêm vào `.env` tại thư mục `eco-nest`, sau đó khởi động lại server:

```dotenv
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=eco-nest
```

Lấy thông tin trong Cloudinary Console. Giữ API secret ở backend.
Folder mặc định là `eco-nest`. Thiếu credentials thì upload trả HTTP 503.

Gửi `POST /media/images/upload` với Bearer token và `multipart/form-data`, field `files`.
Role của token cần có quyền `POST /media/images/upload`.
Mỗi request nhận từ 1 đến 10 ảnh JPG, JPEG, PNG hoặc WebP, mỗi ảnh nhỏ hơn 5 MB (5 × 1024 × 1024 byte).
Ảnh được kiểm tra nội dung, giữ tạm trong RAM và gửi lên Cloudinary.

```sh
curl -X POST http://localhost:3000/media/images/upload -H "Authorization: Bearer YOUR_ACCESS_TOKEN" -F "files=@/path/to/image.png" -F "files=@/path/to/second.jpg"
```

Postman: Body → form-data → key `files` → loại File; chọn nhiều ảnh hoặc thêm các dòng cùng key. Để Postman tự đặt Content-Type. Không gửi thêm text field.

Response HTTP 201:

```json
[
  {
    "url": "https://res.cloudinary.com/your_cloud_name/image/upload/v123/eco-nest/example.png",
    "publicId": "eco-nest/example",
    "width": 800,
    "height": 600,
    "format": "png",
    "bytes": 123456
  }
]
```

Thiếu file hoặc sai định dạng trả HTTP 400; vượt giới hạn Multer trả HTTP 413; lỗi Cloudinary trả HTTP 502.
Route `/media/static/:filename` tiếp tục phục vụ file cũ trên ổ đĩa.

Ảnh được upload lần lượt và kết quả giữ nguyên thứ tự gửi. Nếu một ảnh lỗi, server ngừng upload và thử xóa các ảnh đã upload thành công trong request trước khi trả lỗi. Nếu Cloudinary không cho xóa hoặc mất kết nối, server ghi log publicId cần dọn dẹp; rollback không bảo đảm khi dịch vụ bên ngoài lỗi hoặc tiến trình bị dừng.

Tham khảo: https://cloudinary.com/documentation/node_image_and_video_upload

Chạy test media trong PowerShell (bật ESM để validator đọc chữ ký file):

```powershell
$env:NODE_OPTIONS='--experimental-vm-modules'
npm.cmd test -- --runInBand media
```

Test HTTP cô lập module media và mock Cloudinary; không kiểm tra credentials thật hoặc quyền trong database.
