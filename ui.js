// ui.js

// 导入其他模块的功能
import { parseData } from './data.js';
import { linearRegression } from './math.js';

// 私有变量
let chartInstance = null; 
const AXIS_PADDING_FACTOR = 0.1; 
const LOADING_TIME_MS = 1500; // 进度条显示时间

// 负责绘制图表 (内部函数)
function plotChart(x, y, m, b) {
    // ... (plotChart 逻辑保持不变，因为它只需要 Chart.js，不需要导入其他自定义模块) ...
    const ctx = document.getElementById('regressionChart').getContext('2d');

    // 1. 确定绘图范围 (自动适应逻辑)
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

    const rangeX = maxX - minX;
    const rangeY = maxY - minY;

    const chartMinX = minX - (rangeX === 0 ? 1 : rangeX * AXIS_PADDING_FACTOR);
    const chartMaxX = maxX + (rangeX === 0 ? 1 : rangeX * AXIS_PADDING_FACTOR);
    const chartMinY = minY - (rangeY === 0 ? 1 : rangeY * AXIS_PADDING_FACTOR);
    const chartMaxY = maxY + (rangeY === 0 ? 1 : rangeY * AXIS_PADDING_FACTOR);
    const finalChartMinY = Math.min(0, chartMinY); 

    // 2. 准备数据
    const scatterData = x.map((xi, i) => ({ x: xi, y: y[i] }));
    const regressionData = [
        { x: minX, y: m * minX + b },
        { x: maxX, y: m * maxX + b }
    ];

    // 3. 销毁旧图表实例并创建新图表
    if (chartInstance) { chartInstance.destroy(); }

    chartInstance = new Chart(ctx, {
        type: 'scatter',
        data: {
             datasets: [
                    { label: '原始数据点', data: scatterData, backgroundColor: 'rgba(75, 192, 192, 1)', pointRadius: 5, type: 'scatter' },
                    { label: '线性拟合线', data: regressionData, borderColor: 'rgba(255, 99, 132, 1)', borderWidth: 2, fill: false, pointRadius: 0, tension: 0, type: 'line' }
             ]
        },
        options: { 
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { type: 'linear', min: chartMinX, max: chartMaxX, title: { display: true, text: 'X 值' } },
                y: { min: finalChartMinY, max: chartMaxY, title: { display: true, text: 'Y 值' } }
            },
            parsing: false
        }
    });
}

/**
 * 全局主函数：响应 HTML 按钮点击
 */
export function performLinearRegression() {
    const inputData = document.getElementById('dataInput').value;
    
    // 1. 调用 data.js
    const data = parseData(inputData);

    if (!data) { return; }

    // 2. 显示加载框
    document.getElementById('loadingOverlay').style.display = 'flex';

    // 3. 异步延迟和计算
    setTimeout(() => {
        // 4. 调用 math.js
        const { m, b, r2 } = linearRegression(data.x, data.y);

        // 5. 格式化结果并更新 DOM
        const mFixed = m.toFixed(4);
        const bFixed = b.toFixed(4);
        const r2Fixed = r2.toFixed(4);

        let equation = `y = ${mFixed}x ${bFixed >= 0 ? '+' : '-'} ${Math.abs(bFixed)}`;
        document.getElementById('equationOutput').innerHTML = `拟合方程: <b>${equation}</b>`;
        document.getElementById('rSquaredOutput').innerHTML = `决定系数 R<sup style="font-size: 0.8em;">2</sup>: <b>${r2Fixed}</b>`;

        // 6. 绘制图表
        plotChart(data.x, data.y, m, b);
        
        // 7. 隐藏加载框
        document.getElementById('loadingOverlay').style.display = 'none';
    }, LOADING_TIME_MS); 
}

/**
 * 页面初始化逻辑
 */
function init() {
    const exampleData = "1, 2.1\n2, 3.9\n3, 6.2\n4, 7.8\n5, 10.1";
    document.getElementById('dataInput').value = exampleData;
    
    // 启动主函数
    performLinearRegression(); 
    
    // 绑定事件（将全局函数绑定到 window，供 HTML onclick 调用）
    window.performLinearRegression = performLinearRegression; 

    // 更新页面上的示例格式提示
    document.querySelector('.container p:nth-child(4)').innerHTML = `
        **示例格式 (X, Y)：**<br>
        1, 2.1 (英文逗号)<br>
        2， 3.9 (中文逗号)<br>
        3   6.2 (多个空格)<br>
        4 , 7.8 (混合分隔符)
    `;
}

// 模块加载完成后，执行初始化
init();