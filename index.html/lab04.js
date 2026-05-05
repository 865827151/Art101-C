// 1. 变量 (计数)
let count = 0;

// 2. 对象 (后藤一里数据)
let bocchiData = {
    name: "后藤一里 (Hitori Gotoh)",
    nickname: "波奇酱 (Bocchi)",
    instrument: "Gibson Les Paul Custom",
    // 数组 (她的各种状态)
    states: ["Social Anxiety Mode", "Guitar Hero (Online)", "Meltdown Mode", "Kessoku Band Guitarist"]
};

$(document).ready(function() {
    console.log("Bocchi Database Loaded.");

    $("#needy-button").click(function() {
        count = count + 1;

        // 计算数组索引
        let index = (count - 1) % bocchiData.states.length;
        let currentState = bocchiData.states[index];

        // 构造 Wiki 风格信息
        let message = "<h3>Decrypted File #" + count + "</h3>";
        message += "<p><strong>Name:</strong> " + bocchiData.name + "</p>";
        message += "<p><strong>Current State:</strong> <span style='color:rgb(247, 83, 206);'>" + currentState + "</span></p>";
        message += "<p><strong>Instrument:</strong> " + bocchiData.instrument + "</p>";
        
        if(currentState === "Meltdown Mode") {
            message += "<p><i>Warning: High levels of social stress detected!</i></p>";
        }

        $("#output").html(message);

        // 控制台日志 (用于 Lab 4 截图)
        console.log("Record accessed:", count, "Current State:", currentState);
    });
});