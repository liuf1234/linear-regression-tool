// math.js
/**
 * 执行线性回归 (最小二乘法)
 * @param {number[]} x - x 值数组
 * @param {number[]} y - y 值数组
 * @returns {{m: number, b: number, r2: number}} - 斜率 m, 截距 b, 和决定系数 R²
 */
export function linearRegression(x, y) {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.map((xi, i) => xi * y[i]).reduce((a, b) => a + b, 0);
    const sumXX = x.map(xi => xi * xi).reduce((a, b) => a + b, 0);

    const m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const b = (sumY - m * sumX) / n;

    const yMean = sumY / n;
    const totalSumOfSquares = y.map(yi => (yi - yMean) ** 2).reduce((a, b) => a + b, 0);
    const residualSumOfSquares = y.map((yi, i) => (yi - (m * x[i] + b)) ** 2).reduce((a, b) => a + b, 0);

    let r2 = 0;
    if (totalSumOfSquares !== 0) {
         r2 = 1 - (residualSumOfSquares / totalSumOfSquares);
    } else if (residualSumOfSquares === 0) {
        r2 = 1; 
    }

    return { m, b, r2 };
}