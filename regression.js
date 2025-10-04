/**
 * regression.js
 * 负责执行最小二乘法计算。
 */

/**
 * 执行线性回归计算
 * @param {number[]} x - X 值数组
 * @param {number[]} y - Y 值数组
 * @returns {{m: number, b: number, r2: number}} - 包含斜率m、截距b、R方r2的对象
 */
export function linearRegression(x, y) {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.map((xi, i) => xi * y[i]).reduce((a, b) => a + b, 0);
    const sumXX = x.map(xi => xi * xi).reduce((a, b) => a + b, 0);

    const denominator = n * sumXX - sumX * sumX;

    if (denominator === 0) {
         // 无法进行标准线性拟合
         return { m: 0, b: sumY / n, r2: 0 }; 
    }

    const m = (n * sumXY - sumX * sumY) / denominator;
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