# EcoMart API (NestJS 11)

Backend cho `UI/admin` và `UI/client`. Tài liệu này được kiểm kê từ controller, DTO, guard, service và Prisma schema; không suy ra endpoint từ tên màn hình.

## Chạy dự án

Yêu cầu Node.js, PostgreSQL và Redis. Từ thư mục `eco-nest`:

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run init-see-data
npm run create-permissions
npm run start:dev
```

Build/test: `npm run build`, `npm test`, `npm run test:e2e`. API mặc định ở `http://localhost:3000`.

Biến môi trường: `DATABASE_URL`, `PORT`, `CORS_ORIGINS` (danh sách origin, phân cách bằng dấu phẩy), `ACCESS_TOKEN_SECRET`, `ACCESS_TOKEN_EXPIRED`, `REFRESH_TOKEN_SECRET`, `REFRESH_TOKEN_EXPIRED`, `PAYMENT_API_KEY`, `OTP_EXPIRES_IN`, `RESEND_API_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URL`, `APP_NAME`, `PREFIX_STATIC_ENDPOINT`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_FOLDER`, `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`. Không đưa giá trị bí mật vào frontend hoặc repository.

Migration nằm trong `prisma/migrations`; seed/khởi tạo nằm trong `initialScript`. Script permission phải chạy lại khi thêm route được bảo vệ vì `AccessTokenGuard` đối chiếu chính xác `request.route.path + HTTP method` với bảng permission.

## Quy ước truy cập

- `Public`: không cần token (`@isPublic`).
- `Bearer`: `Authorization: Bearer <accessToken>`; ngoài xác thực JWT còn cần permission đúng path/method trong role.
- `SePay key`: `Authorization: Apikey <PAYMENT_API_KEY>` (guard chỉ lấy phần sau dấu cách).
- Response hiện trả trực tiếp DTO; không có envelope toàn cục. Lỗi validation theo `nestjs-zod`.

## API đã triển khai

| Module | Method và endpoint | Quyền | Input chính | Kết quả / trạng thái |
|---|---|---|---|---|
| App | `GET /` | Bearer | — | Chuỗi health mặc định; hoạt động nhưng bị guard bảo vệ |
| Auth | `POST /auth/register` | Public | email, password, confirmPassword, name, phoneNumber, code | User mới; hoạt động |
| Auth | `POST /auth/otp` | Public | email, type | Gửi OTP qua Resend; phụ thuộc dịch vụ email |
| Auth | `POST /auth/login` | Public | email, password; `totpCode` hoặc `code` khi user bật 2FA | accessToken, refreshToken; hoạt động |
| Auth | `POST /auth/refresh-token` | Public | refreshToken | Cặp token mới, token cũ bị thu hồi |
| Auth | `POST /auth/logout` | Bearer | refreshToken | Thu hồi phiên |
| Auth | `GET /auth/google`, `GET /auth/google/callback` | Public/OAuth | OAuth redirect | Có triển khai, phụ thuộc Google config |
| Auth | `POST /auth/forgot-password` | Public | email, code, newPassword, confirmNewPassword | Đổi mật khẩu |
| Auth | `POST /auth/2fa/setup`, `POST /auth/2fa/disable` | Bearer | setup: body rỗng; disable: totpCode hoặc code | Secret/URI hoặc message |
| Profile | `GET /profile` | Bearer | — | Hồ sơ chính user |
| Profile | `PUT /profile` | Bearer | name, phoneNumber, avatar theo DTO | Hồ sơ đã sửa |
| Profile | `PUT /profile/change-password` | Bearer | password cũ/mới theo DTO | Hồ sơ cập nhật |
| Product client | `GET /product` | Public | page, limit, name, brandIds, categories, min/maxPrice, createdById, sortBy, orderBy | Danh sách phân trang |
| Product client | `GET /product/:productId` | Public | productId | Chi tiết, SKU, brand, category |
| Product quản lý | `GET/POST /manage-product/product`, `GET/PUT/DELETE /manage-product/product/:productId` | Bearer | Query quản lý hoặc product + variants + skus + category IDs | CRUD sản phẩm; seller bị giới hạn theo chủ sở hữu |
| Category | `GET /categories`, `GET /categories/:categoryId` | Public | parentCategoryId tùy chọn | Danh sách/chi tiết |
| Category | `POST /categories`, `PUT/DELETE /categories/:categoryId` | Bearer | name, logo, parentCategoryId; delete có `isHard` | CRUD |
| Brand | `GET /brand`, `GET /brand/:brandId` | Public | page, limit | Danh sách/chi tiết |
| Brand | `POST /brand`, `PUT/DELETE /brand/:brandId` | Bearer | name, logo; delete có `isHard` | CRUD |
| Language | `GET /languages`, `GET /languages/:languageId` | Bearer | — | Danh sách/chi tiết |
| Language | `POST /languages`, `PATCH/DELETE /languages/:languageId` | Bearer | id/name hoặc name | CRUD |
| Translation | `GET /product-translation/:id`, `POST /product-translation`, `PUT/DELETE /product-translation/:id` | Bearer | DTO translation | CRUD product translation |
| Translation | `GET /category-translation/:id`, `POST /category-translation`, `PUT/DELETE /category-translation/:id` | Bearer | DTO translation | CRUD category translation |
| Translation | `GET /brand-translation/:id`, `POST /brand-translation`, `PUT/DELETE /brand-translation/:id` | Bearer | DTO translation | CRUD brand translation |
| Cart | `GET /cart` | Bearer | page, limit | Giỏ nhóm theo shop |
| Cart | `POST /cart` | Bearer | skuId, quantity | Thêm/cộng SKU |
| Cart | `PUT /cart/:cartItemId` | Bearer | skuId, quantity | Cập nhật dòng giỏ |
| Cart | `POST /cart/delete` | Bearer | cartItemIds[] | Xóa nhiều dòng |
| Order | `GET /order` | Bearer | page, limit, status | Chỉ đơn của user hiện tại |
| Order | `POST /order` | Bearer | mảng `{shopId, receiver, cartItemIds[]}` | Tạo payment và đơn theo shop |
| Order | `GET /order/:orderId` | Bearer | orderId | Chi tiết đơn thuộc user |
| Order | `PUT /order/:orderId` | Bearer | — | Hủy đơn thuộc user |
| Payment | `POST /payment/receive` | SePay key | Payload webhook SePay | Đối chiếu và xác nhận thanh toán, idempotent |
| User | `GET/POST /user`, `GET/PUT/DELETE /user/:userId` | Bearer | pagination hoặc DTO user | CRUD user |
| Role | `GET/POST /role`, `GET/PUT/DELETE /role/:roleId` | Bearer | pagination hoặc DTO role/permission IDs | CRUD role |
| Permission | `GET/POST /permissions`, `GET/PUT /permissions/:permissionId`, `DELETE /permissions` | Bearer | pagination/DTO; delete body theo DTO | CRUD permission |
| Media | `POST /media/images/upload` | Bearer | multipart images | Upload Cloudinary |
| Media | `GET /media/static/:filename` | Public | filename | Đọc file local nếu tồn tại |

## Chức năng chỉ có schema/model hoặc còn thiếu

- Prisma có `Review`, `Message`, `Device`, `PaymentTransaction`, nhưng không có REST controller cho review/chat/device/payment history.
- WebSocket hiện chỉ phát `payment.updated`; model `Message` chưa có chat gateway nghiệp vụ.
- Chưa có API admin lấy toàn bộ order, cập nhật trạng thái giao vận, dashboard/report, voucher, wishlist, address hoặc review. `GET /order` luôn lọc `userId`; admin UI không được dùng endpoint này như danh sách toàn hệ thống.
- Chưa có endpoint đọc payment theo `paymentId`; trạng thái payment chỉ thấy gián tiếp qua order/model. Nên bổ sung trước khi xây trang lịch sử thanh toán đầy đủ.
- Chưa có API bulk/batch, export Excel hay search riêng cho role/brand/category ngoài khả năng query đã nêu.

## Luồng SePay và WebSocket

Khi tạo đơn, backend kiểm tra cart/SKU/shop, tạo một `Payment(PENDING)` cùng các order `PENDING_PAYMENT`, trừ tồn kho và xóa cart trong transaction; BullMQ đặt job hết hạn thanh toán. Nội dung chuyển khoản dùng tiền tố `DH` + `paymentId`.

SePay gọi `POST /payment/receive` với API key. Backend lưu `PaymentTransaction` bằng chính ID giao dịch SePay (primary key), lấy `paymentId` từ `code` hoặc `content`, tính tổng snapshot `skuPrice * quantity`, chỉ chấp nhận đúng số tiền, rồi cập nhật `Payment=SUCCESS` và các order thành `PENDING_PICKUP` trong cùng transaction. Retry trùng ID được trả idempotent và không phát lại sự kiện. Sau khi transaction commit, backend mới xóa job BullMQ và phát `payment.updated` qua namespace `/payments`.

Socket client phải gửi access token ở `auth.token` hoặc header Bearer. Gateway verify JWT, chỉ join `user:<userId>` và (với role `ADMIN`) phòng `admins`; sự kiện chứa `paymentId`, `orderIds`, `userId`, `status`. Frontend phải gọi lại REST order/detail sau sự kiện và khi reconnect; frontend tuyệt đối không tự ghi nhận SUCCESS. Nếu quá hạn, worker đổi payment sang `FAILED`, order sang `CANCELLED` và hoàn tồn kho.

## Frontend

Mỗi UI dùng `VITE_API_URL` (mặc định `http://localhost:3000`). Chạy riêng:

```bash
cd UI/admin && npm install && npm run dev
cd UI/client && npm install && npm run dev
```

Admin/client dùng Axios interceptor chung trong từng ứng dụng, lưu access/refresh token ở localStorage, tự refresh và xóa phiên khi hết hạn. Production nên cân nhắc refresh token trong cookie HttpOnly để giảm rủi ro XSS.
