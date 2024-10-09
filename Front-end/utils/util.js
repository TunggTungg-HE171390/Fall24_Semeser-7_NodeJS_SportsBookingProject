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
