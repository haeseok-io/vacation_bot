const cheerio = require('cheerio');
const { axiosCrolling, playwrightCrolling } = require('./crollring');

// --------------------------------------------------------------
//  # 유저 데이터
// --------------------------------------------------------------
let USERID = '';

// --------------------------------------------------------------
//  # 유저 정보
// --------------------------------------------------------------
const userInfo = async username => {
    // Val
    let search_stat = false;
    const result = {error: 0, data: {}};

    // Data
    const croll_url = `https://sa.nexon.com/ranking/total/ranklist.aspx?strSearch=${username}`;
    const croll_data = await axiosCrolling(croll_url);

    if( croll_data.error ){
        result.error = croll_data.error;
        return result;
    }

    // Process
    const $ = cheerio.load(croll_data.data);
    $(".boardList .relative table tbody tr").each((dex, element)=>{
        const $list = $(element);
        const $item = $list.children('td');

        // 동일한 닉네임인지 체크
        const search_name = $item.eq(2).find('a>b').text();

        // 데이터 가공
        if( username===search_name ){
            // 고유 ID
            let user_id             = $item.eq(2).find('a').attr('onclick');
            user_id                 = user_id.match(/GetUserInfo\('user','([^']+)'/)[1].trim();

            // 클랜 ID
            const clan_info         = $item.eq(6).find('a').attr('onclick');
            const clan_id           = clan_info.match(/GetClanInfo\('clan','([^']+)'/)[1].trim();

            // 데이터 담기
            search_stat             = true;
            result.data.id          = user_id;
            result.data.rank        = $item.eq(0).find('b').text().trim();
            result.data.name        = $item.eq(2).find('a>b').text().trim();
            result.data.class_img   = $item.eq(2).find('span>img').attr('src');
            result.data.odd         = $item.eq(3).text().trim();
            result.data.kda         = $item.eq(4).text().trim();
            result.data.record      = $item.eq(5).text().trim();
            result.data.clan_id     = clan_id;
            result.data.clan_name   = $item.eq(6).find('a>b').text().trim();
            result.data.clan_cert   = $item.eq(6).find('a>b').find('img').attr('src');

            // 전역변수에 아이디값 담기
            USERID                  = user_id;
        }
    });

    if( !search_stat ){
        result.error = "입력하신 닉네임은 통합검색에서 검색되지 않습니다.";
        return result;
    }

    // Result
    return result;
}

// --------------------------------------------------------------
//  # 유저 병영 정보
// --------------------------------------------------------------
const userBarracksData = async userid => {
    // Val
    const result = {error: 0, data: ''};

    // Check
    if( !userid ){
        result.error = "전달 데이터 오류입니다.";
        return result;
    }

    // Data
    const croll_url = `https://barracks.sa.nexon.com/${userid}/match`;
    const croll_data = await playwrightCrolling(croll_url);
    if( !croll_data.data ){
        result.error = "유저정보를 가져오는데 실패했습니다.";
        return result;
    }

    // Process
    result.data = croll_data.data;

    // Result
    return result;
}

// --------------------------------------------------------------
//  # 유저 최근동향
// --------------------------------------------------------------
const userTrendData = async userid => {
    // Val
    const result = {error: 0, data: {}, format: []};

    // Check
    if( !userid ){
        result.error = "전달 데이터 오류입니다.";
        return result;
    }

    // Data
    // ... 유저 병영 페이지 크롤링 정보
    const html_data = await userBarracksData(userid);

    // Process
    const $ = cheerio.load(html_data.data);
    const $summaries = $(".summaries").find("p.name").next('ul');
    const $summaries_child = $summaries.find(".child");

    result.data.odd = $summaries.children("li").eq(0).children(".value").text().trim();
    result.data.kda = $summaries.children("li").eq(1).children(".value").text().trim();
    result.data.rifle = $summaries_child.find("li").eq(0).children(".value").text().trim();
    result.data.sniper = $summaries_child.find("li").eq(1).children(".value").text().trim();

    // Etc
    // ... embed용 데이터
    result.format = [
        {name: '\u2009', value: '\u2009'},
        {name: '📌 최근동향 📌', value: '병영수첩 페이지에서 확인되는 정보 입니다.'},
        {name: '\u2009', value: '\u2009'},
        {name: '승률', value: `${result.data.odd}%`},
        {name: 'kda', value: `${result.data.kda}%`, inline: true},
        {name: '라플', value: '12'},
    ];

    // Result
    return result;
}

// --------------------------------------------------------------
//  # 유저 최근매치
// --------------------------------------------------------------
const userMatchData = resource => {
    // Val
    const result = [];

    // Data
    const $ = cheerio.load(resource);

    // Process
    $(".histories .history").each((dex, element)=>{
        const obj = {};
        const $list = $(element);
        const $item = $list.find("ul");

        // 데이터 가공
        obj.date = $item.find("li").eq(0).text().trim();
        obj.map = $item.find("li").eq(1).text().trim();
        obj.type = $item.find("li").eq(2).find(".mode").text().trim();
        obj.stat = $item.find("li").eq(3).find(".result").text().trim();
        obj.kill = $item.find("li").eq(4).find(".value").text().trim();
        obj.death = $item.find("li").eq(5).find(".value").text().trim();
        obj.head = $item.find("li").eq(6).find(".value").text().trim();
        obj.damage = $item.find("li").eq(7).find(".value").text().trim();
        obj.assist = $item.find("li").eq(8).find(".value").text().trim();

        // 배열담기
        result.push(obj);
    });

    // Result
    return result;
}


module.exports = {userInfo, userTrendData};