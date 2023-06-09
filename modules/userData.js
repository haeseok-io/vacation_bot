const cheerio = require('cheerio');
const { axiosCrolling } = require('./crollring');

// --------------------------------------------------------------
//  # 유저 정보
// --------------------------------------------------------------
const userData = async username => {
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
//  # 유저 매치정보
// --------------------------------------------------------------
const userMatchData = async (username, type) => {
    // Val
    const result = {error: '', data: []};

    // Check
    if( !username ){
        result.error = "전달받은 유저ID가 없습니다.";
        return result;
    }


    // Data
    const url = `https://barracks.sa.nexon.com/${user_data.data.id}/match`;
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on('request', (req)=>{
        if( req.isInterceptResolutionHandled() )    return;

        if( req.url().endsWith('.png') || req.url().endsWith('.jpg') )      req.abort();
        else if( req.resourceType()=='image' || req.resourceType()=='xhr' ) req.abort();
        else                                                                req.continue();
    });

    await page.goto(url, {cache: 'force-cache'});
    const content = await page.content();

    await page.close();
    await browser.close();


    console.log(content);
    return false;


    // - 병영수첩 페이지 크롤링 
    // const url = `https://barracks.sa.nexon.com/${userid}/match`;
    // const browser = await puppeteer.launch({headless: "new"});
    // const page = await browser.newPage();

    // await page.goto(url);
    // const content = await page.content();

    // await page.close();
    // await browser.close();

    // - 데이터 가공
    // const $ = cheerio.load(content);

    
    // Result
    return content;
}


module.exports = {
    userData,
    userMatchData
};