/**
 * app.js
 * 应用程序的入口和协调者。
 */
import { parseData } from './dataParser.js';
import { linearRegression } from './regression.js';
import { plotChart } from './chartPlotter.js';

// --- 辅助函数 ---

function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

function updateResults(m, b, r2) {
    const mFixed = m.toFixed(4);
    const bFixed = b.toFixed(4);
    const r2Fixed = r2.toFixed(4);

    let equation = `y = ${mFixed}x ${bFixed >= 0 ? '+' : '-'} ${Math.abs(bFixed)}`;
    document.getElementById('equationOutput').innerHTML = `拟合方程: <b>${equation}</b>`;
    document.getElementById('rSquaredOutput').innerHTML = `决定系数 R<sup style="font-size: 0.8em;">2</sup>: <b>${r2Fixed}</b>`;
}

// --- 主要逻辑 ---

/**
 * 主函数：执行整个拟合和绘图过程
 */
export function performLinearRegression() {
    const inputData = document.getElementById('dataInput').value;
    const data = parseData(inputData);

    if (!data) {
        return;
    }

    showLoading();

    // 使用 setTimeout 模拟异步计算过程，避免阻塞 UI
    setTimeout(() => {
        // 1. 计算
        const { m, b, r2 } = linearRegression(data.x, data.y);

        // 2. 更新结果
        updateResults(m, b, r2);

        // 3. 绘图
        plotChart(data.x, data.y, m, b);
        
        // 4. 隐藏加载提示
        hideLoading();

    }, 800); 
}

/**
 * 初始化函数：设置示例数据并自动运行一次
 */
function init() {
    const exampleData = "1， 2.1\n2, 3.9\n3   6.2\n4  ,  7.8\n5, 10.1";
    document.getElementById('dataInput').value = exampleData;
    
    // 更新示例提示文本
    document.querySelector('.container p:nth-child(4)').innerHTML = `
        **示例格式 (X, Y)：**<br>
        1, 2.1 (英文逗号)<br>
        2， 3.9 (中文逗号)<br>
        3   6.2 (多个空格)<br>
        4 , 7.8 (混合分隔符)
    `;

    // 运行初始拟合
    performLinearRegression();
}

// 页面加载完成后，运行初始化函数
document.addEventListener('DOMContentLoaded', init);