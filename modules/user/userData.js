const cheerio = require('cheerio');
const { axiosCrolling, playwrightCrolling } = require('../crollring');

// --------------------------------------------------------------
//  # userInfoData (유저정보)
// --------------------------------------------------------------
const userInfoData = async username => {
    // Val
    const rs_data = {error: 0, data: {}};

    // Check
    if( !username ){
        rs_data.error = '전달 데이터 오류';
        return rs_data;
    }

    // Data
    // ... 데이터 크롤링
    const croll_url = `https://sa.nexon.com/ranking/total/ranklist.aspx?strSearch=${username}`;
    const croll_data = await axiosCrolling(croll_url);
    if( croll_data.error ){
        rs_data.error = croll_data.error;
        return rs_data;
    }

    // Process
    // ... 데이터 가공
    const $ = cheerio.load(croll_data.data);
    $(".boardList .relative table tbody tr").each((dex, element)=>{
        const $list = $(element);
        const $item = $list.children('td');

        // - 회원정보
        const item_name = $item.eq(2).find('a>b').text();
        const item_id = $item.eq(2).find('a').attr('onclick').match(/GetUserInfo\('user','([^']+)'/)[1].trim();

        // - 데이터 담기
        if( username===item_name ){
            rs_data.data.id          = item_id;
            rs_data.data.rank        = $item.eq(0).find('b').text().trim();
            rs_data.data.name        = $item.eq(2).find('a>b').text().trim();
            rs_data.data.class_img   = $item.eq(2).find('span>img').attr('src');
            rs_data.data.odd         = $item.eq(3).text().trim();
            rs_data.data.kda         = $item.eq(4).text().trim();
            rs_data.data.record      = $item.eq(5).text().trim();
            rs_data.data.clan_name   = $item.eq(6).find('a>b').text().trim();
            rs_data.data.clan_cert   = $item.eq(6).find('a>b').find('img').attr('src');
        }
    });

    if( !rs_data.data.id ){
        rs_data.error = '통합검색 페이지에서 조회되는 정보가 없습니다.';
        return rs_data;
    }

    // Result
    return rs_data;
}

// --------------------------------------------------------------
//  # userTrendData (유저 최근동향)
// --------------------------------------------------------------
const userTrendData = async userid => {
    // Val
    const rs_data = {error: 0, data: {}};

    // Check
    if( !userid ){
        rs_data.error = '전달 데이터 오류';
        return rs_data;
    }
    
    // Data
    // ... 데이터 크롤링
    const croll_url = `https://barracks.sa.nexon.com/${userid}/match`;
    const croll_data = await playwrightCrolling(croll_url);
    if( !croll_data.data ){
        rs_data.error = "데이터 추출 오류";
        return rs_data;
    }

    // Process
    // ... 데이터 가공
    const $ = cheerio.load(croll_data.data);

    const $summaries = $(".summaries").find("p.name").next('ul');
    const $summaries_child = $summaries.find(".child");

    rs_data.data.odd = $summaries.children("li").eq(0).children(".value").text().trim();
    rs_data.data.kda = $summaries.children("li").eq(1).children(".value").text().trim();
    rs_data.data.rifle = $summaries_child.find("li").eq(0).children(".value").text().trim();
    rs_data.data.sniper = $summaries_child.find("li").eq(1).children(".value").text().trim();

    // Result
    return rs_data;
}

// --------------------------------------------------------------
//  # userMatchData (유저 최근매치)
// --------------------------------------------------------------
const userMatchData = async userid => {
    // Val
    const rs_data = {error: 0};
    const match_list = [];

    // Check
    if( !userid ){
        rs_data.error = '전달 데이터 오류';
        return rs_data;
    }

    // Data
    // ... 데이터 크롤링
    const croll_url = `https://barracks.sa.nexon.com/${userid}/match`;
    const croll_data = await playwrightCrolling(croll_url);
    if( !croll_data.data ){
        rs_data.error = "데이터 추출 오류";
        return rs_data;
    }

    // Process
    // ... 데이터 가공
    const $ = cheerio.load(croll_data.data);
    $(".histories .history").each((dex, element)=>{
        const obj = {};
        const $list = $(element);
        const $item = $list.find("ul");

        // 데이터 담기
        obj.date = $item.find("li").eq(0).text().trim();
        obj.map = $item.find("li").eq(1).text().trim();
        obj.type = $item.find("li").eq(2).find(".mode").text().trim();
        obj.stat = $item.find("li").eq(3).find(".result").text().trim();
        obj.kill = $item.find("li").eq(4).find(".value").text().trim();
        obj.death = $item.find("li").eq(5).find(".value").text().trim();
        obj.head = $item.find("li").eq(6).find(".value").text().trim();
        obj.damage = $item.find("li").eq(7).find(".value").text().trim();
        obj.assist = $item.find("li").eq(8).find(".value").text().trim();

        // 생존은 제외
        if( obj.type==='생존시즌' ) return;

        match_list.push(obj);
    });

    // Result
    rs_data.data = match_list;
    return rs_data;
}

// --------------------------------------------------------------
//  # exports
// --------------------------------------------------------------
module.exports = {
    userInfoData,
    userTrendData,
    userMatchData
};