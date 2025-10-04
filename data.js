// data.js
/**
 * 负责从输入的文本中解析 X, Y 数据数组。
 * @param {string} inputData - 文本区域的输入内容
 * @returns {{x: number[], y: number[]} | null}
 */
export function parseData(inputData) {
    const lines = inputData.trim().split('\n').filter(line => line.trim() !== '');
    const x = [];
    const y = [];

    for (const line of lines) {
        // 支持中英文逗号、空格、Tab
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