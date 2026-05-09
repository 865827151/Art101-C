/**
 * ART101 Lab 5 - Functions & Conditionals
 * 功能：封装环境函数，解决跳转闪烁，实现状态循环解密
 */

const characters = [
    {
        title: "Bocchi",
        name: "后藤一里 (Hitori Gotoh)",
        img: "images/Boochi.jpg",
        color: "#fff0f5",
        instrument: "Gibson Les Paul Custom",
        states: ["Social Anxiety Mode", "Guitar Hero", "Meltdown Mode", "Kessoku Band Guitarist"]
    },
    {
        title: "Kita",
        name: "喜多郁代 (Ikuyo Kita)",
        img: "images/Kita.jpg",
        color: "#fff5ee",
        instrument: "Gibson Les Paul Junior",
        states: ["Kita-aura ✨", "Social Butterfly Mode", "Vocalist Mode", "Guitar Learner"]
    }
];

let charIndex = 0;
let stateClickCount = 0; // 用于追踪点击次数，实现状态循环

/**
 * --- 【Lab 5 函数：更新环境与角色】 ---
 */
function switchCharacter(index) {
    let idx = parseInt(index);

    // --- 【Lab 5 条件判断】 ---
    if (idx >= 0 && idx < characters.length) {
        charIndex = idx;
        stateClickCount = 0; // 换人时重置状态点击计数
        const char = characters[charIndex];

        // 改变背景环境
        $("body").css({
            "background-color": char.color,
            "transition": "background-color 0.8s ease"
        });

        // 解决闪烁动画
        $(".character-card").animate({ opacity: 0 }, 200, function() {
            $(".main-title").text("Character File: " + char.title);
            $("#char-img").attr("src", char.img);
            $("#char-name-sub").text(char.name);
            
            // 切换时重置输出区域
            $("#output").html("<p style='color:#888; font-style:italic;'>Database Switched. Ready to Decrypt.</p>");
            
            $(this).animate({ opacity: 1, top: "0px" }, 400);
        });
    }
}

/**
 * --- 【新增函数：展示并循环状态】 ---
 * 满足 Lab 5 关于封装动作的要求
 */
function decryptStatus() {
    stateClickCount++; // 每次点击增加计数
    const char = characters[charIndex];
    
    // 计算当前应该显示哪个状态 (循环逻辑)
    const currentStateIndex = (stateClickCount - 1) % char.states.length;
    const currentState = char.states[currentStateIndex];

    let message = `<div style="margin-top:20px; text-align:left; border-top:1px solid rgba(0,0,0,0.1); padding-top:15px; animation: fadeIn 0.5s ease;">`;
    message += `<h3>Decrypted File #${stateClickCount}</h3>`;
    message += `<p><strong>Name:</strong> ${char.name}</p>`;
    message += `<p><strong>Instrument:</strong> ${char.instrument}</p>`;
    message += `<p><strong>Current State:</strong> <span style="color:rgb(247, 83, 206);">${currentState}</span></p>`;
    
    // 如果是特殊状态，加一个警告提醒
    if(currentState.includes("Meltdown") || currentState.includes("aura")) {
        message += `<p style="margin-top:10px; font-size:12px; color:#ffb6c1;"><i>⚠️ Signal Anomaly detected.</i></p>`;
    }
    message += `</div>`;

    $("#output").html(message);
}

$(document).ready(function() {
    // A. 处理初始化加载
    const urlParams = new URLSearchParams(window.location.search);
    const charId = urlParams.get('id');

    if (charId !== null) {
        switchCharacter(charId);
    } else {
        switchCharacter(0);
    }

    // B. 【黑按钮点击】：直接调用解密函数，实现状态循环
    $("#needy-button").click(function() {
        decryptStatus();
    });

    // C. 【右下角箭头】：调用换人函数
    $("#next-char-trigger").click(function() {
        let next = (charIndex + 1) % characters.length;
        switchCharacter(next);
    });
});