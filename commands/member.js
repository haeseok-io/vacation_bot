const { SlashCommandBuilder, EmbedBuilder, Embed } = require('discord.js');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const crolling_obj = {
    href: "https://barracks.sa.nexon.com/clan/rankblock/clanMatch",
    select_path: '.simplebar-content ul li',
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('클랜원목록')
        .setDescription('현재 클랜원 정보를 알려줘요!'),
    async execute(interaction){
        // 데이터 가져오기
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(crolling_obj.href);
        const content = await page.content();

        await page.close();
        await browser.close();

        // 데이터 수집
        const $ = cheerio.load(content);
        const user_info = [];

        $(crolling_obj.select_path).each(function(dex, element){
            // Val
            const $data = $(element);
            const $item = $data.find(".user-info");

            // Data
            const user_name = $item.find(".user-name strong").text();
            const user_duty = $item.find(".user-text").eq(0).find("span").eq(0).text();
            const user_online = $data.find(".user-picture.online").html() ? true : false;

            // Result
            user_info.push({name: user_name, duty: user_duty, online: user_online});
        });

        // 데이터 정렬
        // - 클랜 직책순으로 정렬
        const sort_arr = ['클랜마스터', '부마스터', '운영진', '열혈클랜원', '건설가', '클랜원'];
        const sort_data = user_info.sort((a,b) => sort_arr.indexOf(a.duty)-sort_arr.indexOf(b.duty));
        
        // 데이터 가공
        let data_list = '';
        let data_online = 0;

        sort_data.forEach((data)=>{
            if( data_list ) data_list += "\n";
            data_list += "- "+data.name+" ("+data.duty+")";

            if( data.online ){
                data_online++;
                data_list += " `접속중`";
            }
        });

        // 디스코드 전송용 포맷 만들기
        const embed_obj = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('휴가 클랜 클랜원 목록')
            .setURL('https://barracks.sa.nexon.com/clan/rankblock/clanMatch')
            .setDescription('휴가클랜 페이지에서 확인되는 클랜원 목록 입니다.')
            .addFields(
                {name: '📋 현황', value: `- 총 클랜원 ${sort_data.length}명 중 ${data_online}명 접속중입니다.`},
                {name: '🌵 클랜원 상세정보', value: data_list}
            );



        // embed_obj.addFields({name: '클랜원 목록', value: result});

        // 발송
        // await interaction.reply('유동우(김동우)는 병신이다!!!!');
        await interaction.reply({embeds: [embed_obj]});
    }
};