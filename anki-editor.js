// ==UserScript==
// @name         Anki Editor Markdown Handler
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Handle markdown paste in Anki editor
// @author       Your name
// @match        *://localhost:*/
// @grant        none
// ==/UserScript==

<div id="front" style="text-align: center;">
<script>
if (typeof window.ankiEditorInitialized === 'undefined') {
    window.ankiEditorInitialized = true;
    
    // 添加粘贴事件监听器
    document.addEventListener('paste', function(e) {
        console.log("📋 检测到粘贴事件");
        
        const target = e.target;
        if (!target.isContentEditable && target.tagName !== 'TEXTAREA' && target.tagName !== 'INPUT') {
            console.log("❌ 不是可编辑区域，跳过");
            return;
        }
        console.log("✅ 粘贴目标是可编辑区域:", target.tagName);

        const clipboardData = e.clipboardData || window.clipboardData;
        if (!clipboardData) {
            console.log("❌ 无法获取剪贴板数据");
            return;
        }

        const text = clipboardData.getData('text/plain');
        const html = clipboardData.getData('text/html');
        
        console.log("📄 剪贴板格式:");
        console.log("- text/plain 长度:", text?.length || 0);
        console.log("- text/html 长度:", html?.length || 0);
        console.log("- text/plain 内容:", text);

        // Markdown 特征检测
        const hasMarkdownFeatures = (text) => {
            if (!text) return false;
            
            const features = {
                codeBlock: /```[\s\S]*?```/m,
                inlineCode: /`[^`]+`/,
                headers: /^#{1,6}\s/m,
                lists: /^[-*+]\s|^\d+\.\s/m,
                blockquote: /^>\s/m,
                table: /\|.*\|.*\n\|[-:|\s]+\|/,
                mermaid: /```mermaid/,
                emphasis: /(\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_)/,
                horizontalRule: /^[-*_]{3,}\s*$/m,
                link: /\[([^\]]+)\]\([^)]+\)/,
                image: /!\[([^\]]*)\]\([^)]+\)/,
                taskList: /^- \[[x ]\]/m,
                footnote: /\[\^[^\]]+\]/,
                definitionList: /^[^:\n]+:\s*$/m,
                latex: /\$\$[\s\S]*?\$\$|\$[^$\n]+\$/
            };

            // 检查每个特征
            for (const [name, regex] of Object.entries(features)) {
                if (regex.test(text)) {
                    console.log(`✅ 检测到 ${name} 特征`);
                    return true;
                }
            }

            // 额外检查
            if (text.includes('---') ||
                text.includes('> ') ||
                text.includes('* ') ||
                text.includes('- ') ||
                (text.match(/\n/g) || []).length > 2) {
                console.log("✅ 检测到基本 Markdown 特征");
                return true;
            }

            return false;
        };

        if (text && hasMarkdownFeatures(text)) {
            console.log("📝 使用 Markdown 模式粘贴");
            e.preventDefault();
            document.execCommand('insertText', false, text);
        } else {
            console.log("📄 使用默认粘贴行为");
        }
    });
}
</script>
{{Front}}
</div>

<div class='tags'><p class="tag">{{Tags}}</p></div> 