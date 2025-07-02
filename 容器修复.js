function fixMermaidContainerComplete() {
    console.log('🔧 开始全面修复容器...');
    
    // 1. 找到Mermaid容器及其所有父容器
    const mermaidDiv = document.querySelector('.mermaid');
    if (!mermaidDiv) {
        console.log('❌ 未找到Mermaid容器');
        return;
    }
    
    // 2. 获取SVG的实际尺寸
    const svg = mermaidDiv.querySelector('svg');
    if (!svg) {
        console.log('❌ 未找到SVG元素');
        return;
    }
    
    const svgWidth = parseFloat(svg.getAttribute('width'));
    const svgHeight = parseFloat(svg.getAttribute('height'));
    
    console.log('📐 SVG尺寸:', {
        width: svgWidth,
        height: svgHeight
    });
    
    // 3. 添加全面的容器样式
    const style = document.createElement('style');
    style.textContent = `
        /* Mermaid容器 */
        .mermaid {
            width: ${svgWidth + 40}px !important; /* SVG宽度 + padding */
            height: ${svgHeight + 40}px !important;
            margin: 0 auto !important;
            position: relative !important;
            overflow: visible !important;
            padding: 20px !important;
            box-sizing: content-box !important;
        }
        
        /* Anki卡片容器 */
        #qa, .card, .card-content {
            width: auto !important;
            min-width: ${svgWidth + 80}px !important; /* 确保足够宽 */
            overflow: visible !important;
            position: relative !important;
        }
        
        /* 所有可能的父容器 */
        .card-container,
        .reviewer,
        .reviewer-wrapper,
        #outer,
        #inner,
        #qa {
            width: auto !important;
            min-width: ${svgWidth + 80}px !important;
            overflow: visible !important;
            position: relative !important;
            padding: 0 !important;
            margin: 0 auto !important;
        }
        
        /* 确保滚动条正确显示 */
        html, body {
            overflow-x: auto !important;
            min-width: ${svgWidth + 80}px !important;
        }
    `;
    
    // 移除旧样式
    if (window._mermaidContainerStyle) {
        window._mermaidContainerStyle.remove();
    }
    
    document.head.appendChild(style);
    window._mermaidContainerStyle = style;
    
    // 4. 直接设置容器样式
    let parent = mermaidDiv;
    while (parent && parent !== document.body) {
        parent.style.width = 'auto';
        parent.style.minWidth = `${svgWidth + 80}px`;
        parent.style.overflow = 'visible';
        parent.style.position = 'relative';
        parent = parent.parentElement;
    }
    
    console.log('✅ 容器修复完成');
}

// 执行修复
fixMermaidContainerComplete();