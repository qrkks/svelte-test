function fixMermaidForeignObjects() {
    console.log('🔧 开始修复 ForeignObject 渲染...');
    
    try {
        const svg = document.querySelector('.mermaid svg');
        if (!svg) {
            throw new Error('未找到SVG元素');
        }
        
        // 添加精确的样式
        const style = document.createElement('style');
        style.textContent = `
            /* SVG 基础设置 */
            .mermaid svg {
                overflow: visible !important;
            }
            
            /* 节点容器 */
            .mermaid .node {
                overflow: visible !important;
            }
            
            /* 基础矩形 */
            .mermaid .node rect.basic.label-container {
                rx: 5px !important;
                ry: 5px !important;
                stroke-width: 2px !important;
            }
            
            /* ForeignObject 容器 */
            .mermaid .node foreignObject {
                overflow: visible !important;
                font-family: "Microsoft YaHei", "微软雅黑", Arial, sans-serif !important;
            }
            
            /* 文本容器 */
            .mermaid .node foreignObject div {
                display: inline-block !important;
                white-space: normal !important;
                word-wrap: break-word !important;
                padding: 8px !important;
                text-align: center !important;
                width: auto !important;
                max-width: none !important;
            }
            
            /* 文本标签 */
            .mermaid .node .nodeLabel {
                font-size: 14px !important;
                line-height: 1.4 !important;
                color: inherit !important;
            }
            
            /* 确保emoji正确显示 */
            .mermaid .node .nodeLabel span {
                font-family: "Segoe UI Emoji", "Noto Color Emoji", sans-serif !important;
            }
        `;
        
        if (window._mermaidStyle) {
            window._mermaidStyle.remove();
        }
        document.head.appendChild(style);
        window._mermaidStyle = style;
        
        // 修复每个节点
        const nodes = svg.querySelectorAll('.node');
        nodes.forEach((node, index) => {
            const rect = node.querySelector('rect.basic.label-container');
            const foreignObject = node.querySelector('foreignObject');
            const contentDiv = foreignObject?.querySelector('div');
            
            if (rect && foreignObject && contentDiv) {
                // 获取原始位置
                const rectX = parseFloat(rect.getAttribute('x'));
                const rectY = parseFloat(rect.getAttribute('y'));
                
                // 计算新尺寸（考虑内容和padding）
                const padding = 16;
                const contentRect = contentDiv.getBoundingClientRect();
                const newWidth = contentRect.width + (padding * 2);
                const newHeight = contentRect.height + (padding * 2);
                
                // 更新矩形
                rect.setAttribute('width', newWidth);
                rect.setAttribute('height', newHeight);
                
                // 更新foreignObject
                foreignObject.setAttribute('width', newWidth - padding);
                foreignObject.setAttribute('height', newHeight - padding);
                
                // 调整内容div样式
                contentDiv.style.width = '100%';
                contentDiv.style.height = '100%';
                contentDiv.style.display = 'flex';
                contentDiv.style.alignItems = 'center';
                contentDiv.style.justifyContent = 'center';
                
                console.log(`节点 ${index + 1} 已更新:`, {
                    content: contentDiv.textContent.trim(),
                    newSize: { width: newWidth, height: newHeight }
                });
            }
        });
        
        console.log('\n✅ 修复完成');
        
    } catch (err) {
        console.error('❌ 修复过程出错:', err);
    }
}

// 执行修复
fixMermaidForeignObjects();