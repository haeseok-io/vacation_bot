const axios = require('axios');
const puppeteer = require('puppeteer');
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

module.exports = {
    axiosCrolling
}