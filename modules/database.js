const { config } = require('dotenv');
const mysql = require('mysql');
config();

// --------------------------------------------------------------
//  # 데이터베이스 접속
// --------------------------------------------------------------
const pool = mysql.createPool({
    connectionLimit: 20,
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// --------------------------------------------------------------
//  # 데이터베이스 쿼리 실행
// --------------------------------------------------------------
const dbQuery = async query => {
    // Val
    let result;

    // Data
    // ... 데이터베이스 연결
    const queryPromise = new Promise((resolve, reject) => {
        pool.query(query, (error, results) => {
            if( error ){
                console.log(`DB :: ${error}`);
                reject(error);
            } else {
                console.log(`DB :: ${query}`);
                resolve(results);
            }
        });
    });

    // Result
    result = await queryPromise;
    return result;
}

// --------------------------------------------------------------
//  # 데이터베이스 정보 가져오기 (단일)
// --------------------------------------------------------------
const dbData = async query => {
    // Val
    let result;

    // Data
    // ... 쿼리 실행
    const execute = await dbQuery(query);

    // Process
    result = execute[0];

    // Result
    return result;
}

// --------------------------------------------------------------
//  # 데이터베이스 정보 가져오기 (다중)
// --------------------------------------------------------------
const dbDataMulti = async query => {
    // Val
    const result = [];

    // Data
    // ... 쿼리 실행
    const execute = await dbQuery(query);

    // Process
    execute.forEach((data, dex)=>{
        result.push(data);
    });

    // Result
    return result;
}

module.exports = { dbQuery, dbData, dbDataMulti };