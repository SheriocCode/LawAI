document.addEventListener('DOMContentLoaded', () => {
    // 遮罩层
    const historyIcon = document.querySelector('#historyIcon');
    const historyOverlay = document.querySelector('.overlay');
    const closeIcon = document.querySelector('.overlay .history-close');
    historyIcon.addEventListener('click', () => {
        historyOverlay.style.display = 'block';
    });
    closeIcon.addEventListener('click', () => {
        historyOverlay.style.display = 'none';
    });
    
    // 左侧菜单栏activate
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            // 移除所有项目的 active 类
            menuItems.forEach(i => i.classList.remove('active'));
            // 为点击的项目添加 active 类
            item.classList.add('active');
        });
    });
    
    // 跳转history
    const historyBtn = document.querySelector('.historyIcon');
    if (historyBtn) {
        historyBtn.addEventListener('click', () => {
            window.location.href = 'html/history.html'; // 替换为你的历史记录页面URL
        });
    }

    // 获取下拉菜单元素
    const dropdownTitle = document.querySelector('.conversation-title');
    const dropdown = document.querySelector('.conversation-dropdown');
    
    if (dropdownTitle && dropdown) {
        dropdownTitle.addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止事件冒泡
            dropdown.classList.toggle('active');
            
            // 点击外部关闭下拉菜单
            const closeDropdown = (event) => {
                if (!dropdown.contains(event.target)) {
                    dropdown.classList.remove('active');
                    document.removeEventListener('click', closeDropdown);
                }
            };
            
            // 添加点击事件监听器
            setTimeout(() => {
                document.addEventListener('click', closeDropdown);
            }, 0);
        });
    }
    
    // 中间聊天区域
    const userMessage = document.querySelector('.user-message');
    const chatMessages = document.querySelector('.chat-messages');
    const placeholderText = document.querySelector('.placeholder');
    const sendBtn = document.querySelector('.send-btn'); // 发送按钮
    const input = document.querySelector('.main-input'); // 输入框
    const sendIcon = sendBtn.querySelector('.send-icon'); // 发送图标

    
    // 初始隐藏用户消息框
    userMessage.style.display = 'none';


    async function sendMessage() {
        const message = input.value.trim();
        if (!message) return;
    
        // 创建用户消息元素
        const userMsgDiv = document.createElement("div");
        userMsgDiv.className = "message user-message";
        userMsgDiv.innerHTML = `
            <div class="message-content">
                <p class="user-text">${message}</p>
            </div>
        `;
        chatMessages.appendChild(userMsgDiv);

        // 清空输入框并重置
        input.value = '';
        input.blur();

        // 将前面的头像全部变为静态的
        const avatars = document.querySelectorAll('.avatar img');
        avatars.forEach(avatar => {
            avatar.src = './img/world_static_fade.png';
        });

        const { reader: reader, decoder: decoder } = await sendFirstRequest(message);
    
        // 创建 AI 消息元素
        const aiMessageDiv = document.createElement("div");
        aiMessageDiv.className = "message ai-message";
        aiMessageDiv.innerHTML = `
            <div class="avatar">
                <img src="./img/world.gif" alt="AI头像">
            </div>
            <div class="message-content">
                <p class="ai-text">...</p>
                <div class="message-time"></div>
            </div>
        `;
        chatMessages.appendChild(aiMessageDiv);

        // 实时更新 AI 回复
        let aiText = "";
        
        reader.read().then(async function processText({ done, value }) {
            if (done) {
                console.log("Final Markdown Text:", aiText); // 打印最终的 Markdown 文本
                const htmlContent = marked.parse(aiText);
                aiMessageDiv.querySelector(".ai-text").innerHTML = htmlContent;
                aiMessageDiv.querySelector(".message-time").textContent = 'Sherioc 回答于：' + new Date().toLocaleTimeString();

                MathJax.typeset(); // 渲染 MathJax
                hljs.highlightAll();
                
                // 添加推荐内容
                aiMessageDiv.innerHTML += `
                    <div class="message-recommend">
                        <div class="recommend_1"></div>
                        <div class="recommend_2"></div>
                        <div class="recommend_3"></div>
                    </div>
                `;
                chatMessages.scrollTop = chatMessages.scrollHeight;

                // 默认添加动画效果
                const recommendElements = aiMessageDiv.querySelectorAll('.message-recommend > div');
                recommendElements.forEach(element => {
                element.classList.add('recommend-animation');
                });

                const { reader: reader2, decoder: decoder2 } = await sendSecondRequest(htmlContent, aiMessageDiv);
                let aiText2 = "";
                reader2.read().then(async function processText({ done, value }) {
                    aiText2 += decoder2.decode(value, { stream: false });
                    const elements = JSON.parse(aiText2);
                    aiMessageDiv.querySelector(".recommend_1").innerHTML = elements[0]
                    aiMessageDiv.querySelector(".recommend_2").innerHTML = elements[1]
                    aiMessageDiv.querySelector(".recommend_3").innerHTML = elements[2]

                })

                // 更新最后一次头像为静态的 
                imgs = document.querySelectorAll('.avatar img');
                if (imgs.length > 0) {
                    imgs[imgs.length - 1].src = './img/world_static.png';
                }

                recommendElements.forEach(element => {
                    element.classList.remove('recommend-animation');
                });

                return;
            }
            aiText += decoder.decode(value, { stream: true });

            aiMessageDiv.querySelector(".ai-text").innerHTML = marked.parse(aiText);

            MathJax.typeset(); // 渲染 MathJax
            hljs.highlightAll();
            
            // 滚动到最新消息
            chatMessages.scrollTop = chatMessages.scrollHeight;
            return reader.read().then(processText);
        })

    }


    // stream请求
    async function sendFirstRequest(message) {
        try {
            const response = await fetch("http://127.0.0.1:5000/stream_chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: [
                        { role: "system", content: "你是Sherioc, 一个智能法律助手" },
                        { role: "user", content: message },
                    ],
                }),
            });
            
    
            if (!response.ok) {
                console.error("Failed to fetch response");
                return;
            }
            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            return { reader: reader, decoder: decoder };
        } catch (error) {
            console.error("Error in first request:", error); 
        }
    }

    // recommend请求
    async function sendSecondRequest(htmlContent, aiMessageDiv) {
        // aiMessageDiv = document.querySelector('.ai-message');
        try {
            const response2 = await fetch("http://127.0.0.1:5000/normal_chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: [
                        { role: "system", content: "你是Sherioc, 一个智能法律助手" },
                        { role: "user", content: '对话如下：' + htmlContent + '请给我三条继续问题的相关推荐(每条在20字以内,开头添加相关表情包), 以数组格式返回(例如：["🤔recommend1_str","🔗recommend2_str","recommend3_str"]' },
                    ],
                }),
            });
    
            if (!response2.ok) {
                console.error("Failed to fetch recommendation response");
                return;
            }
            reader2 = response2.body.getReader();
            decoder2 = new TextDecoder();
            return { reader: reader2, decoder: decoder2 };
        } catch (error) {
            console.error("Error in second request:", error);
        }
    }


    sendBtn.addEventListener('click', sendMessage);
    
    // 回车发送
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // 监听输入框的输入事件
    input.addEventListener('input', () => {
        if (input.value.trim()) {
            sendIcon.classList.add('active');
        } else {
            sendIcon.classList.remove('active');
        }
    });

    // 输入框焦点事件
    input.addEventListener('focus', () => {
        placeholderText.style.opacity = '0';
    });

    input.addEventListener('blur', () => {
        if (!input.value) {
            placeholderText.style.opacity = '1';
            sendIcon.classList.remove('active');
        }
    });

    // 工作台
    const workspaceToggle = document.querySelector('.workspace-toggle');
    const workspaceSidebar = document.querySelector('.workspace-sidebar');
    const closeWorkspace = document.querySelector('.close-workspace');

    // 切换工作台显示状态
    workspaceToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        workspaceSidebar.classList.toggle('open');
        workspaceToggle.classList.toggle('active');
        // 添加过渡类
        document.body.classList.toggle('workspace-open');
    });

    // 点击关闭按钮
    closeWorkspace.addEventListener('click', () => {
        workspaceSidebar.classList.remove('open');
        workspaceToggle.classList.remove('active');
        document.body.classList.remove('workspace-open');
    });

    // 点击外部区域关闭
    document.addEventListener('click', (e) => {
        if (!workspaceSidebar.contains(e.target) && 
            !workspaceToggle.contains(e.target) && 
            workspaceSidebar.classList.contains('open')) {
            workspaceSidebar.classList.remove('open');
            workspaceToggle.classList.remove('active');
            document.body.classList.remove('workspace-open');
        }
    });


});