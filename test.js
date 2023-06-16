const database = require('./modules/database');


const run = async () => {
    
        const test = await database.dbData("Select * From user_search_log Where message_key='1119162612974878830'");
        console.log(test);
};


run();
