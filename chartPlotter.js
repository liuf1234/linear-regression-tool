/**
 * chartPlotter.js
 * 负责使用 Chart.js 绘制散点图和拟合线。
 */

// 轴的自动扩展比例
const AXIS_PADDING_FACTOR = 0.1; 
let chartInstance = null; // 用于存储 Chart.js 实例

/**
 * 绘制图表
 * @param {number[]} x - 原始 X 值数组
 * @param {number[]} y - 原始 Y 值数组
 * @param {number} m - 斜率
 * @param {number} b - 截距
 */
export function plotChart(x, y, m, b) {
    const ctx = document.getElementById('regressionChart').getContext('2d');

    // 1. 计算范围
    const dataMinX = Math.min(...x);
    const dataMaxX = Math.max(...x);
    const dataMinY = Math.min(...y);
    const dataMaxY = Math.max(...y);

    const predictedYMin = m * dataMinX + b;
    const predictedYMax = m * dataMaxX + b;

    const minX = dataMinX;
    const maxX = dataMaxX; 
    const minY = Math.min(dataMinY, predictedYMin, predictedYMax);
    const maxY = Math.max(dataMaxY, predictedYMin, predictedYMax);

    // 2. 应用自动扩展（Padding）
    const rangeX = maxX - minX;
    const rangeY = maxY - minY;

    const xPadding = rangeX === 0 ? 1 : rangeX * AXIS_PADDING_FACTOR;
    const yPadding = rangeY === 0 ? 1 : rangeY * AXIS_PADDING_FACTOR;

    const chartMinX = minX - xPadding;
    const chartMaxX = maxX + xPadding;
    const chartMaxY = maxY + yPadding;
    
    const finalChartMinY = Math.min(0, minY - yPadding); 

    // 原始散点数据
    const scatterData = x.map((xi, i) => ({ x: xi, y: y[i] }));

    // 拟合线数据
    const regressionData = [
        { x: minX, y: m * minX + b },
        { x: maxX, y: m * maxX + b }
    ];

    // 销毁旧图表实例（如果有）
    if (chartInstance) {
        chartInstance.destroy();
    }

    // 创建新图表实例
    chartInstance = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: '原始数据点',
                    data: scatterData,
                    backgroundColor: 'rgba(75, 192, 192, 1)',
                    pointRadius: 5,
                    type: 'scatter'
                },
                {
                    label: '线性拟合线',
                    data: regressionData,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 0, 
                    tension: 0, 
                    type: 'line' 
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: { display: true, text: 'X 值' },
                    min: chartMinX,
                    max: chartMaxX 
                },
                y: {
                    title: { display: true, text: 'Y 值' },
                    min: finalChartMinY,
                    max: chartMaxY
                }
            },
            plugins: {
                legend: { display: true },
                title: { display: true, text: '数据散点图与线性拟合' }
            },
            parsing: false
        }
    });
}