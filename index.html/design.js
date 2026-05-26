/**
 * ART101 Lab 7 - 3D Interactive Carousel (Mouse Drag & Inertia Engine)
 * 功能：将原本死板的点击切盘全面重构为“商场旋转玻璃门”的自由鼠标拖拽滑行机制。
 */

$(document).ready(function() {
    let currentAngle = 0;      // 实时旋转角度
    let isDragging = false;    // 鼠标是否按住拖拽中
    let startX = 0;           // 鼠标按下时的初始物理 X 坐标
    let baseAngle = 0;         // 拖拽开始时轮盘的初始角度
    
    // ==========================================================================
    // 🎬 1. 动态自适应卡片工厂
    // ==========================================================================
    function build3DCarousel() {
        const wheel = $(".carousel-wheel");
        wheel.empty(); 
        for (let i = 0; i < 4; i++) {
            let cardHtml = "";
            if (typeof designWorks !== 'undefined' && designWorks[i]) {
                cardHtml = `
                    <div class="carousel-card glass-card" data-index="${i}" data-title="${designWorks[i].title}" data-desc="${designWorks[i].desc}">
                        <div class="card-image-box">
                            <img src="${designWorks[i].img}" alt="Design Work">
                            <div class="card-hover-overlay">
                                <h3 class="overlay-title">${designWorks[i].title}</h3>
                                <p class="overlay-desc">${designWorks[i].desc}</p>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                cardHtml = `
                    <div class="carousel-card glass-card empty-panel" data-index="${i}" data-title="SYSTEM NODE // VACANT" data-desc="Empty slot. No graphic assets designated to this record channel yet.">
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

    // 根据跨页 ?id= 执行初始角度对齐
    const urlParams = new URLSearchParams(window.location.search);
    const designId = urlParams.get('id'); 
    let initialIndex = designId !== null ? parseInt(designId) : 0;
    currentAngle = -(initialIndex * 90);
    
    // 执行初次高亮分配
    updateCardStates();
    $(".carousel-wheel").css({
        "transform": "translateZ(-250px) rotateY(" + currentAngle + "deg)",
        "transition": "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)"
    });

    // ==========================================================================
    // 🚀 2. 核心：像旋转门一样的鼠标自由拖拽算法链
    // ==========================================================================
    
    // A. 鼠标按下：捕获锚点
    $(document).on("mousedown", ".carousel-container", function(e) {
        isDragging = true;
        startX = e.pageX;         // 记录按下的横向坐标
        baseAngle = currentAngle; // 锁死当前角度作为拖拽基准线
        
        // 拖拽进行时，必须瞬间移除 CSS 的 transition 缓动动画，否则拖拽会严重粘手延迟！
        $(".carousel-wheel").css("transition", "none");
    });

    // B. 鼠标移动：旋转门实时跟手滚转
    $(document).on("mousemove", function(e) {
        if (!isDragging) return;
        
        let deltaX = e.pageX - startX; // 计算鼠标横向移动了多少像素
        
        // 物理比例尺：鼠标在屏幕上每拖拽 3 像素，3D 玻璃门就旋转 1 度
        currentAngle = baseAngle + (deltaX / 3);
        
        // 实时渲染跟手滚转，后退 250px 腾出空间
        $(".carousel-wheel").css("transform", "translateZ(-250px) rotateY(" + currentAngle + "deg)");
        updateCardStates(); // 实时计算哪张卡片正对观众
    });

    // C. 鼠标抬起/离屏：智能吸附到最近的 $90^\circ$ 面板上面
    $(document).on("mouseup mouseleave", function() {
        if (!isDragging) return;
        isDragging = false;

        // 🚀 核心纠偏：计算松手时，转盘最接近哪一个 90 度的倍数
        let closestIndex = Math.round(-currentAngle / 90);
        currentAngle = -(closestIndex * 90); // 强行校准到绝对吸附角度

        // 松手复位时，必须重新加回 transition 1.2s 缓动，让旋转门极其顺滑地“滑行”归位
        $(".carousel-wheel").css({
            "transition": "transform 1.2s cubic-bezier(0.23, 1, 0.32, 1)",
            "transform": "translateZ(-250px) rotateY(" + currentAngle + "deg)"
        });

        updateCardStates();
    });

    // ==========================================================================
    // ⚙️ 3. 动态解密状态机：自动计算哪张卡片正对着观众
    // ==========================================================================
    function updateCardStates() {
        // 根据当前旋转角度，逆向换算出当前正对最前方的卡片索引 (0,1,2,3)
        let normalizedAngle = (Math.round(-currentAngle / 90) % 4 + 4) % 4;

        $(".carousel-card").removeClass("facing-front");
        let $frontCard = $(".carousel-card[data-index='" + normalizedAngle + "']");
        $frontCard.addClass("facing-front"); // 分发面向观众的高亮控制类

        // 抓取文字注入下方大抽屉
        let title = $frontCard.attr("data-title");
        let desc = $frontCard.attr("data-desc");
        $("#meta-title").text(title);
        $("#meta-desc").text(desc);
    }
});