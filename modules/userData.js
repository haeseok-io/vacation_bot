const puppeteer = require('puppeteer');
const cheerio = require('cheerio');


// --------------------------------------------------------------
//  # 유저 정보
// --------------------------------------------------------------
const userData = async username => {
    // Val
    const result = {error: '', data: {id: '', name: ''}};
    let match_stat = false;

    // Check
    if( !username ){
        result.error = "전달받은 유저명이 않습니다.";
        return result;
    }

    // Data
    // - 통합검색 페이지 크롤링
    const url = "https://sa.nexon.com/ranking/total/ranklist.aspx?strSearch="+username;
    const browser = await puppeteer.launch({headless: "new"});
    const page = await browser.newPage();
    
    await page.goto(url);
    const content = await page.content();

    await page.close();
    await browser.close();

    // - 데이터 가공
    const $ = cheerio.load(content);
    $(".relative table tbody tr").each(function(dex, element){
        const $item = $(element);
        const match_name = $item.find('td').eq(2).find('a>b').text();

        if( username===match_name ){
            let match_user_data = [];
            const match_regex = /'([^']*)'/g;
            const match_user_info = $item.find('td').eq(2).find('a').attr('onclick');

            while(match_user_item = match_regex.exec(match_user_info)){
                match_user_data.push(match_user_item[1]);
            }

            result.data.id = match_user_data[1];
            result.data.name = match_name;

            match_stat = true;
        }
    });

    // Etc
    // - 매칭된 닉네임이 없을경우
    if( !match_stat ){
        result.error = "통합검색에서 검색되지 않습니다.";
        return result;
    }

    // Result
    return result;
}

// --------------------------------------------------------------
//  # 유저 매치정보
// --------------------------------------------------------------
const userMatchData = async (userid, type) => {
    // Val
    const result = {error: '', data: []};

    // Check
    if( !userid ){
        result.error = "전달받은 유저ID가 없습니다.";
        return result;
    }

    // Data
    // - 병영수첩 페이지 크롤링 
    const url = `https://barracks.sa.nexon.com/${userid}/match`;
    const browser = await puppeteer.launch({headless: "new"});
    const page = await browser.newPage();

    await page.goto(url);
    const content = await page.content();

    await page.close();
    await browser.close();

    // - 데이터 가공
    // const $ = cheerio.load(content);

    
    // Result
    return result;
}


module.exports = {
    userData,
    userMatchData
};