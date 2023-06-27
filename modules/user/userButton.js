const { ActionRowBuilder } = require('discord.js');
const database = require("../database");

// --------------------------------------------------------------
//  # 유저조회 버튼
// --------------------------------------------------------------
const userSearchButton = async userid => {
    // Val
    let trend_btn, match_btn, bad_btn;

    // Data
    trend_btn = require('../../buttons/userTrend').data;
    match_btn = require('../../buttons/userMatch').data;

    // Process
    // ... 비매너 유저 등록 여부 체크
    const sql = `Select * From user_bad_manners Where user_id='${userid}'`;
    const data = await database.dbData(sql);

    // ... 비매너 등록별 버튼 제어
    if( data )  bad_btn = require('../../buttons/userBadDelete').data;
    else        bad_btn = require('../../buttons/userBadWrite').data;

    // Etc
    // ... 컴포넌트 생성
    const button_component = new ActionRowBuilder().addComponents(trend_btn, match_btn, bad_btn);

    // Result
    return button_component;
}

module.exports = {
    userSearchButton
}