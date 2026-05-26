/**
 * ART101 Lab 7 - 3D 自由旋转门物理驱动引擎
 * 功能：将定角点击完全重构为“鼠标按住随意拖拽滑行、松手智能吸附对齐”的旋转门系统。
 */

$(document).ready(function() {
    let currentAngle = 0;      // 实时旋转角度
    let isDragging = false;    // 是否拖拽中
    let startX = 0;           // 鼠标按下的初始 X 坐标
    let baseAngle = 0;         // 拖拽开始时轮盘的角度基准线
    
    // ==========================================================================
    // 🎬 1. 动态生成 4 个 3D 槽位 HTML
    // ==========================================================================
    function build3DCarousel() {
        const wheel = $(".carousel-wheel");
        wheel.empty(); 
        for (let i = 0; i < 4; i++) {
            let cardHtml = "";
            if (typeof designWorks !== 'undefined' && designWorks[i]) {
                cardHtml = `
                    <div class="carousel-card glass-card" data-index="${i}" data-title="${designWorks[i].title}">
                        <div class="card-image-box">
                            <img src="${designWorks[i].img}" alt="Design Work">
                        </div>
                    </div>
                `;
            } else {
                cardHtml = `
                    <div class="carousel-card glass-card empty-panel" data-index="${i}" data-title="SYSTEM NODE // VACANT">
                        <div class="card-image-box empty-card">
                            <div class="acrylic-reflection"></div>
                        </div>
                    </div>
                `;
            }
            wheel.append(cardHtml);
        }
    }

    build3DCarousel();

    // 跨页传参路由解析对齐
    const urlParams = new URLSearchParams(window.location.search);
    const designId = urlParams.get('id'); 
    let initialIndex = designId !== null ? parseInt(designId) : 0;
    currentAngle = -(initialIndex * 90);
    
    // 初始化对齐
    updateCardStates();
    $(".carousel-wheel").css({
        "transform": "translateZ(-250px) rotateY(" + currentAngle + "deg)",
        "transition": "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)"
    });

    // ==========================================================================
    // 🚀 2. 旋转门鼠标横向自由拖拽控制链
    // ==========================================================================
    
    // A. 鼠标按下：锁定物理锚点
    $(document).on("mousedown", ".carousel-container", function(e) {
        isDragging = true;
        startX = e.pageX;         
        baseAngle = currentAngle; 
        
        // 拖拽时立刻掐断 CSS 缓动 transition，确保百分之百跟手感
        $(".carousel-wheel").css("transition", "none");
    });

    // B. 鼠标移动：转盘无限制跟手旋转
    $(document).on("mousemove", function(e) {
        if (!isDragging) return;
        
        let deltaX = e.pageX - startX; // 计算鼠标拉动了多少像素
        
        // 比例尺：横向每拉动 3 像素，3D 玻璃门就跟手旋转 1 度，可无限往左/往右拉
        currentAngle = baseAngle + (deltaX / 3);
        
        $(".carousel-wheel").css("transform", "translateZ(-250px) rotateY(" + currentAngle + "deg)");
        updateCardStates(); // 实时测算哪个面正对观众
    });

    // C. 鼠标抬起/离开网页：带惯性顺滑吸附对齐到最近的 $90^\circ$ 面板
    $(document).on("mouseup mouseleave", function() {
        if (!isDragging) return;
        isDragging = false;

        // 计算松手时距离哪一个 90 度的卡片最近
        let closestIndex = Math.round(-currentAngle / 90);
        currentAngle = -(closestIndex * 90); // 强行拉回标准吸附线

        // 复位时加回 1.2 秒的物理缓动过渡，让玻璃门优雅滑行对齐
        $(".carousel-wheel").css({
            "transition": "transform 1.2s cubic-bezier(0.23, 1, 0.32, 1)",
            "transform": "translateZ(-250px) rotateY(" + currentAngle + "deg)"
        });

        updateCardStates();
    });

    // ==========================================================================
    // ⚙️ 3. 动态状态机：重新分发高亮类并解码标题
    // ==========================================================================
    function updateCardStates() {
        let normalizedAngle = (Math.round(-currentAngle / 90) % 4 + 4) % 4;

        $(".carousel-card").removeClass("facing-front");
        let $frontCard = $(".carousel-card[data-index='" + normalizedAngle + "']");
        $frontCard.addClass("facing-front"); 

        let title = $frontCard.attr("data-title");
        $("#meta-title").text(title);
    }
});