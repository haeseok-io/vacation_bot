const axios = require('axios');
const { chromium } = require('playwright');
const cheerio = require('cheerio');

// --------------------------------------------------------------
//  # axios 크롤링
// --------------------------------------------------------------
const axiosCrolling = async url => {
    // Val
    const result = {error: '', data: ''};

    // Check
    if( !url ){
        result.error = "전달 데이터 오류입니다.";
        return result;
    }

    // Data
    const response = await axios.get(url);
    if( !response.data ){
        result.error = "처리 중 오류가 발생하였습니다. (1)";
        return result;
    }

    // Result
    result.data = response.data;
    return result;
}

// --------------------------------------------------------------
//  # playwright 크롤링
// --------------------------------------------------------------
const playwrightCrolling = async url => {
    // Val
    const result = {error: '', data: ''};

    // Check
    if( !url ){
        result.error = "전달 데이터 오류입니다.";
        return result;
    }

    // Data
    const browser = await chromium.launch({headless: true});
    const context = await browser.newContext();

    const page = await context.newPage();
    page.route('**/*', (route, resource)=>{
        if( resource.resourceType()==='other' )     route.abort();
        else                                        route.continue();
    });

    await page.goto(url);
    const response = await page.content();

    await page.close();
    await browser.close();

    // Result
    result.data = response;
    return result;
}

module.exports = {
    axiosCrolling,
    playwrightCrolling
}