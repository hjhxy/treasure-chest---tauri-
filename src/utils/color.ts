export function getRandomSoftColor() {
    // 生成随机的 RGB 值，避免极端值
    const r = Math.floor(Math.random() * 128) + 127;  // 127-255
    const g = Math.floor(Math.random() * 128) + 127;  // 127-255
    const b = Math.floor(Math.random() * 128) + 127;  // 127-255
    // 随机生成一个不为 0 的 alpha 值
    const alpha = (Math.random() / 1.2).toFixed(2);
    // console.log(alpha);
    // 组装成 rgba 格式的字符串并返回
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}