const { SlashCommandBuilder, EmbedBuilder, Embed } = require('discord.js');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const crolling_obj = {
    href: "https://barracks.sa.nexon.com/clan/rankblock/clanMatch",
    select_path: '.simplebar-content ul li',
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('member')
        .setDescription('현재 클랜원 정보를 알려줘요!'),
    async execute(interaction){
        const embed_obj = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('휴가 클랜 클랜원 목록')
            .setURL('https://barracks.sa.nexon.com/clan/rankblock/clanMatch')
            .setDescription('휴가클랜 페이지에서 확인되는 클랜원 목록 입니다.')
            .addFields();

        // puppeteer 사용하여 브라우저 정보 가져오기
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(crolling_obj.href);

        const content = await page.content();

        await page.close();
        await browser.close();

        // cheerio 사용하여 가져온 정보 가공
        const user_obj = [];
        const $ = cheerio.load(content);
        $(crolling_obj.select_path).each(function(idx, element){
            const $data = cheerio.load(element);
            
            const user_info = $data(".user-info");
            const user_name = user_info.find(".user-name strong").text();
            const user_duty = user_info.find(".user-text").eq(0).find("span").eq(0).text();
            const user_online = $data(".user-picture.online").html() ? true : false;

            user_obj.push({name: user_name, duty: user_duty, online: user_online});
            // result += `- ${user_name} (${user_duty})\n`;
        });

        // 클랜 직책순으로 정렬
        user_obj.each(function(idx, data){
            console.log(data);
        });

        // embed_obj.addFields({name: '클랜원 목록', value: result});

        // 발송
        console.log(user_obj);
        // await interaction.reply({embeds: [embed_obj]});
    }
};