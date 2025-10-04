/**
 * dataParser.js
 * 负责解析原始文本输入，将其转换为数值数组。
 */

/**
 * 解析输入数据
 * @param {string} inputData - 文本区域的输入内容
 * @returns {{x: number[], y: number[]} | null} - 包含 x 和 y 数组的对象，如果数据无效则返回 null
 */
export function parseData(inputData) {
    const lines = inputData.trim().split('\n').filter(line => line.trim() !== '');
    const x = [];
    const y = [];

    for (const line of lines) {
        // 匹配英文逗号, 空白字符, 或中文逗号
        const parts = line.split(/[,\s\t，]+/).map(p => p.trim()).filter(p => p !== '');
        
        if (parts.length >= 2) {
            const xVal = parseFloat(parts[0]);
            const yVal = parseFloat(parts[1]);

            if (!isNaN(xVal) && !isNaN(yVal)) {
                x.push(xVal);
                y.push(yVal);
            }
        }
    }

    if (x.length < 2) {
        alert("错误：数据点不足2个或格式不正确。请至少输入两行有效的 X,Y 数据。");
        return null;
    }

    return { x, y };
}
