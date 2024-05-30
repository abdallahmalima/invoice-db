import mysql from 'mysql2/promise';

const callProducts=  async function(query: string, data: any) {



try {

const db = await mysql.createConnection({
host: process.env.MYSQL_HOST,
database: process.env.MYSQL_DATABASE,
user: process.env.MYSQL_USER,
password: process.env.MYSQL_PASSWORD

})

const [result] = await db.execute(query, data);

await db.end();

return result;

} catch (error) {

console.log(error);

return error;

}

}

export default callProducts;