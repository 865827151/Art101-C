/**
 * ART101 Lab 6 - Integrated Central Database (Anime + Graphic Design)
 * 功能：中央唯一数据仓库。包含动漫角色解密数据与 2D 平面设计资产列表。
 * 核心：以后添加新设计作品，只需在最底部的 designWorks 数组中加一行，全站自动同步！
 */

// ==========================================================================
// 🎸 SECTION A: 动漫美少女角色核心数据源 (保持你原有的完美逻辑)
// ==========================================================================
const characters = [
    {
        title: "Bocchi",
        name: "后藤一里 (Hitori Gotoh)",
        img: "images/Boochi.jpg",
        color: "#fff0f5",
        instrument: "Gibson Les Paul Custom",
        states: ["Social Anxiety Mode", "Guitar Hero", "Meltdown Mode", "Kessoku Band Guitarist"],
        backDesc: "A guitarist plagued by extreme social anxiety, unable to make eye contact and heavily reliant on virtual validation. Under her online alias 'guitarhero', she harbors an explosive, transcendent musical talent. Though she frequently retreats into her cardboard box to flee reality, her raw, aggressive riffing and emotional solos serve as the lethal weapon that rips through the mundane essence of Kessoku Band."
    },
    {
        title: "Kita",
        name: "喜多郁代 (Ikuyo Kita)",
        img: "images/Kita.jpg",
        color: "#fff5ee",
        instrument: "Gibson Les Paul Junior",
        states: ["Kita-aura ✨", "Social Butterfly Mode", "Vocalist Mode", "Guitar Learner"],
        backDesc: "An ultra-charismatic social butterfly occupying the absolute peak of high school extroversion. Propelled by her blind adoration for Ryo, she accidentally stumbled into the band scene. Despite initially fleeing due to zero musical experience, her sheer purity and rigorous practice rapidly closed the technical gap. As the band's radiant vocalist, her voice anchors four isolated souls under the bright sun."
    },
    {
        title: "Nijika",
        name: "伊地知虹夏 (Nijika Ijichi)",
        img: "images/nijika.jpg",
        color: "#fffdf0", 
        instrument: "Yamaha Recording Custom Drum Kit",
        states: ["Angel of Shimokitazawa", "Kessoku Band Leader", "Big Sister Mode", "Energetic Drummer"],
        backDesc: "The enigmatic 'Angel of Shimokitazawa' and the true architect behind Kessoku Band. Beneath her impeccable, nurturing warmth lies an unshakeable, fierce rock-and-roll obsession. To fulfill a lifelong dream shared with her sister, she captured and accommodated three eccentric outcasts. Her relentless, precise drumming stands as the ultimate compass when the collective soul loses its way."
    },
    {
        title: "Ryo",
        name: "山田凉 (Ryo Yamada)",
        img: "images/ryo.jpg",
        color: "#f0f5ff", 
        instrument: "Fender Precision Bass",
        states: ["Eccentric Bassist", "Grass Eater", "Cool Blue Mode", "Solo Composer"],
        backDesc: "An aloof, volatile bassist who strictly refuses conformity, often eating weeds to survive after spending all her funds on vintage gear. Possessing a near-obsessive purism toward musical aesthetics, she fiercely rejects commercial compromises. It is her unconventional, avant-garde basslines and cold, artistic detached demeanor that elevate Kessoku Band far beyond the traditional cliché of high school girls' music."
    }
];

let charIndex = 0;
let stateClickCount = 0; 
let following = false;   

/**
 * --- 【更新环境与角色】 ---
 */
function switchCharacter(index) {
    let idx = parseInt(index);

    if (idx >= 0 && idx < characters.length) {
        charIndex = idx;
        stateClickCount = 0; 
        const char = characters[charIndex];

        // 改变背景环境颜色
        $("body").css({
            "background-color": char.color,
            "transition": "background-color 0.8s ease"
        });

        // 解决闪烁动画逻辑 (保留原有平滑过渡)
        $(".character-card").animate({ opacity: 0 }, 200, function() {
            $(".main-title").text("Character File: " + char.title);
            $("#char-img").attr("src", char.img);
            $("#char-name-sub").text(char.name);
            
            $("#output").html("<p style='color:#888; font-style:italic;'>Database Switched. Ready to Decrypt.</p>");
            
            $(this).animate({ opacity: 1 }, 400);
        });
    }
}

/**
 * --- 【解密状态循环】 ---
 */
function decryptStatus() {
    stateClickCount++; 
    const char = characters[charIndex];
    
    const currentStateIndex = (stateClickCount - 1) % char.states.length;
    const currentState = char.states[currentStateIndex];

    let message = `<div style="margin-top:20px; text-align:left; border-top:1px solid rgba(0,0,0,0.1); padding-top:15px; animation: fadeIn 0.5s ease;">`;
    message += `<h3>Decrypted File #${stateClickCount}</h3>`;
    message += `<p><strong>Name:</strong> ${char.name}</p>`;
    message += `<p><strong>Instrument:</strong> ${char.instrument}</p>`;
    message += `<p><strong>Current State:</strong> <span style="color:rgb(247, 83, 206); font-weight:bold;">${currentState}</span></p>`;
    
    if(currentState.includes("Meltdown") || currentState.includes("aura") || currentState.includes("Angel")) {
        message += `<p style="margin-top:10px; font-size:12px; color:#ffb6c1;"><i>⚠️ Signal Anomaly: High intensity energy detected.</i></p>`;
    }
    message += `</div>`;

    $("#output").html(message);
}

$(document).ready(function() {
    // A. 处理初始化加载
    const urlParams = new URLSearchParams(window.location.search);
    const charId = urlParams.get('id');

    // 💡 只有当页面存在动漫渲染节点时才执行初始化，防止污染独立 design.html 页面
    if ($("#gallery-grid").length || $(".character-card").length) {
        if (charId !== null) {
            switchCharacter(charId);
        } else {
            switchCharacter(0);
        }
    }

    // B. 黑按钮点击事件
    $("#needy-button").click(function() {
        decryptStatus();
    });

    // C. 右下角箭头切换
    $("#next-char-trigger").click(function() {
        let next = (charIndex + 1) % characters.length;
        switchCharacter(next);
    });

    // ==========================================
    // 💡 D. 只对图片区进行悬停与动态 3D 翻转 (全英文高级版)
    // ==========================================
    $(".card-scene").hover(
        function() {
            const char = characters[charIndex];
            
            $("#back-char-title").text("ぼっち・ざ・ろっく！"); 
            $("#back-char-instrument").text("DECRYPTED STATUS // SYSTEM: ONLINE");
            
            let profileHtml = `
                <div class="back-states-list">
                    <h4>[ CORE RECORD ]</h4>
                    <p style="font-size: 11px; line-height: 1.7; color: #1d1d1f; letter-spacing: 0.3px; text-align: justify; font-weight: 400; margin-top: 10px;">
                        ${char.backDesc}
                    </p>
                </div>
            `;
            $("#back-char-states").html(profileHtml);

            $(this).find(".image-wrapper").addClass("flipped");
        },
        function() {
            $(this).find(".image-wrapper").removeClass("flipped");
        }
    );

    // ==========================================
    // 💡 E. 全局键盘空格键（Space）开关
    // ==========================================
    $(document).keydown(function(event) {
        // 💡 仅在动漫详情页激活此光圈跟随逻辑，避免干扰 3D 轮盘的空格自转逻辑
        if ($(".character-card").length && (event.key === " " || event.code === "Space")) {
            event.preventDefault(); 
            following = !following; 

            if (following === true) {
                $("#spotlight").fadeIn(300);
                $("#output").html("<p style='color:rgb(247, 83, 206); font-style:italic;'>Live Spotlight Mode Active. Move your cursor.</p>");
            } else {
                $("#spotlight").fadeOut(200);
                $("#output").html("<p style='color:#888; font-style:italic;'>Spotlight Mode Disabled.</p>");
            }
        }
    });

    // ==========================================
    // 💡 F. 鼠标移动控制聚光灯光圈跟随
    // ==========================================
    $(document).mousemove(function(event) {
        if (following === true) {
            $("#spotlight").css({
                left: event.pageX,
                top: event.pageY
            });
        }
    });
});


// ==========================================================================
// 🎨 ✨ SECTION B: 全新追加的 2D 平面设计专属数据仓库 (Data Reservoir)
// ==========================================================================
const designWorks = [
    { 
        title: "BREW & CO. EDITORIAL", 
        img: "images/coffee.png", 
        desc: "Structured typography and warm ambient tones for commercial menu design." 
    },
    { 
        title: "COZY CAFÉ ILLUSTRATION", 
        img: "images/coffee2.jpg", 
        desc: "A serene Japanese watercolor aesthetic featuring refreshing blue tones, hand-drawn typography, and delicate visual storytelling." 
    }
    // 🚀 【捷径声明】：以后你有任何新作品，直接在下方复制粘贴追加新行即可，全站两边页面自动加载！
    // 例：{ title: "作品名", img: "images/图名.jpg", desc: "英文简述。" }
];