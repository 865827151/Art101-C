/**
 * ART101 Lab 6 - Gallery Filtering & Unified Search
 * 功能：实现 Anime 与 2D Design 分类无缝平滑切换，并执行“锁定分类”的智能搜索
 */

$(document).ready(function() {
    // 默认初始分类状态锁定为 'anime'
    let currentCategory = "anime";

    // ==========================================
    // 💡 交互 1：分段标签切换 (Tab Item Click)
    // ==========================================
    $(".tab-item").click(function() {
        // A. 样式排他性切换
        $(".tab-item").removeClass("active");
        $(this).addClass("active");

        // B. 刷新当前高亮的分类变量
        currentCategory = $(this).attr("data-category");

        // C. 切换分类时清空搜索框里的文字，恢复完美的初始画廊状态
        $("#search-bar").val("");

        // D. 极简流式淡入淡出动画
        $(".gallery-grid .char-card").stop(true, true).fadeOut(200, function() {
            // 当所有卡片都淡出隐藏后，只把符合当前点击分类（data-cat）的卡片呼唤出来
            $(".gallery-grid .char-card[data-cat='" + currentCategory + "']").fadeIn(300);
        });
    });

    // ==========================================
    // 💡 交互 2：分类锁定智能搜索 (On Keyup)
    // ==========================================
    $("#search-bar").on("keyup", function() {
        // 抓取并格式化用户输入的搜索词
        let value = $(this).val().toLowerCase().trim();

        // 【核心代码】：使用选择器严格限定范围，只遍历当前被选中的分类卡片
        $(".gallery-grid .char-card[data-cat='" + currentCategory + "']").each(function() {
            // 获取当前卡片中 h3 标签里的文字（即卡片名，如 Bocchi 或 Coffee Menu）
            let cardText = $(this).find("h3").text().toLowerCase();

            // 执行条件判断，匹配成功则淡淡呈现，否则优雅隐去
            if (cardText.indexOf(value) > -1) {
                $(this).stop(true, true).fadeIn(200);
            } else {
                $(this).stop(true, true).fadeOut(200);
            }
        });
    });
});