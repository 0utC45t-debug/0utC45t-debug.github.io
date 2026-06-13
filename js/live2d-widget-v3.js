// 定义 CDN 路径（使用原作者的 CDN 加载核心库和样式）
const cdnPath = "https://cdn.jsdelivr.net/gh/letere-gzj/live2d-widget-v3@main";

const config = {
  // 资源路径配置
  path: {
    homePath: "/",
    // 关键修改：把模型路径指向我们本地的 source/Resources/
    modelPath: "/Resources/", 
    cssPath: cdnPath + "/waifu.css",
    tipsJsonPath: cdnPath + "/waifu-tips.json",
    tipsJsPath: cdnPath + "/waifu-tips.js",
    live2dCorePath: cdnPath + "/Core/live2dcubismcore.js",
    live2dSdkPath: cdnPath + "/live2d-sdk.js"
  },
  // 工具栏按钮
  tools: ["hitokoto", "asteroids", "express", "switch-model", "switch-texture", "photo", "info", "quit"],
  // 允许拖拽模型
  drag: {
    enable: true,
    direction: ["x", "y"]
  },
  // 切换模式
  switchType: "order"
}

// 仅在电脑端（屏幕宽度大于768px）加载，防止手机端挡视线
if (screen.width >= 768) {
  Promise.all([
    loadExternalResource(config.path.cssPath, "css"),
    loadExternalResource(config.path.live2dCorePath, "js"),
    loadExternalResource(config.path.live2dSdkPath, "js"),
    loadExternalResource(config.path.tipsJsPath, "js")
  ]).then(() => {
    initWidget({
      waifuPath: config.path.tipsJsonPath,
      cdnPath: config.path.modelPath,
      tools: config.tools,
      dragEnable: config.drag.enable,
      dragDirection: config.drag.direction,
      switchType: config.switchType
    });
  });
}

// 异步加载外部资源的通用函数
function loadExternalResource(url, type) {
  return new Promise((resolve, reject) => {
    let tag;
    if (type === "css") {
      tag = document.createElement("link");
      tag.rel = "stylesheet";
      tag.href = url;
    } else if (type === "js") {
      tag = document.createElement("script");
      tag.src = url;
    }
    if (tag) {
      tag.onload = () => resolve(url);
      tag.onerror = () => reject(url);
      document.head.appendChild(tag);
    }
  });
}