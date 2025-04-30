const multer = require('multer');

// Cấu hình lưu file
const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, 'uploads/'); // lưu vào thư mục uploads
   },
   filename: function (req, file, cb) {
      const foodName = req.body.foodName.replace(/\s+/g, '-').toLowerCase(); // thay ký tự trắng bằng dấu - và chuyển thành chữ thường
      const fileExtension = file.mimetype.split('/')[1]; // lấy phần mở rộng của file
      const fileName = Math.round(Math.random() * 1E9) + '-' + foodName + '.' + fileExtension; // tên file là tên thực phẩm + thời gian hiện tại + phần mở rộng
      cb(null, fileName);
   }
});

const upload = multer({ storage: storage });

module.exports = { upload };