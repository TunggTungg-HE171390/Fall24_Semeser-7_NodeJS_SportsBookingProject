/**
 * Kiểm tra xem một trường có hợp lệ (không rỗng).
 * @param {string} field - Trường cần kiểm tra.
 * @returns {boolean} - Trả về true nếu trường hợp lệ, ngược lại false.
 */
export const isValidField = (field) => {
  return field && field.trim().length > 0;
};

/**
 * Kiểm tra định dạng email hợp lệ.
 * @param {string} email - Email cần kiểm tra.
 * @returns {boolean} - Trả về true nếu email hợp lệ, ngược lại false.
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Kiểm tra định dạng số điện thoại hợp lệ.
 * @param {string} phone - Số điện thoại cần kiểm tra.
 * @returns {boolean} - Trả về true nếu số điện thoại hợp lệ, ngược lại false.
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^\d{10,11}$/;
  return phoneRegex.test(phone);
};

/**
 * Kiểm tra tính hợp lệ của tên người dùng.
 * @param {string} username - Tên người dùng cần kiểm tra.
 * @returns {boolean} - Trả về true nếu tên người dùng hợp lệ, ngược lại false.
 */
export const isValidUsername = (username) => {
  // Độ dài tối thiểu và tối đa (ví dụ: từ 3 đến 20 ký tự)
  if (username.length < 3 || username.length > 20) {
    return false;
  }

  // Chỉ cho phép các ký tự chữ cái, số, dấu gạch dưới và dấu chấm
  const usernameRegex = /^[a-zA-Z0-9_.]+$/;
  if (!usernameRegex.test(username)) {
    return false;
  }

  return true;
};
