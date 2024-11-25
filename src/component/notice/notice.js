// notice.js
export function showAlert(message) {
    // Lấy thẻ thông báo và thẻ chứa nội dung
    const notification = document.getElementById("notification");
    const notificationMessage = document.getElementById("notification-message");

    // Cập nhật nội dung thông báo
    notificationMessage.innerText = message;

    // Hiển thị thông báo
    notification.classList.remove("hidden");
    notification.classList.add("show");

    // Ẩn thông báo sau một thời gian (ví dụ 5 giây)
    setTimeout(() => {
        notification.classList.remove("show");
        notification.classList.add("hidden");
    }, 5000);  // Thời gian hiển thị là 5 giây
}
