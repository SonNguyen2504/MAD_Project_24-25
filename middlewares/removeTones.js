const removeTones = (str) => {
    return str
        .normalize('NFD') // Chuyển đổi chuỗi thành dạng NFD (Normalization Form D)
        .replace(/[\u0300-\u036f]/g, '') // Xóa các ký tự dấu
        .replace(/đ/g, 'd') // Thay thế 'đ' thành 'd'
        .replace(/Đ/g, 'D') // Thay thế 'Đ' thành 'D'
        .trim();
}

module.exports = removeTones;