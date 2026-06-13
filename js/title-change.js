// 保存原始标题
const originalTitle = document.title;

// 监听页面可见性变化（切换标签页）
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    // 页面隐藏时（用户切换到其他标签页）
    document.title = '(ᗜ ˰ ᗜ) 我会想你的喵';
  } else {
    // 页面显示时（用户切回来）
    document.title = 'Ciallo～(∠・ω< )⌒☆';
    // 2秒后恢复原始标题
    setTimeout(() => {
      document.title = originalTitle;
    }, 2000);
  }
});