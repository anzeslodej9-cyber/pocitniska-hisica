const { neon } = require('@netlify/neon');

const sql = neon();

exports.handler = async function(event, context) {
  try {
    if (event.httpMethod === 'GET') {
      const result = await sql`SELECT date FROM occupied_dates ORDER BY date`;
      const dates = result.map(row => row.date);
      return {
        statusCode: 200,
        body: JSON.stringify(dates),
        headers: { 'Content-Type': 'application/json' },
      };
    } else if (event.httpMethod === 'POST') {
      const { date } = JSON.parse(event.body);
      await sql`INSERT INTO occupied_dates (date) VALUES (${date}) ON CONFLICT (date) DO NOTHING`;
      return { statusCode: 200, body: JSON.stringify({ message: 'Datum dodan' }) };
    } else if (event.httpMethod === 'DELETE') {
      const { date } = JSON.parse(event.body);
      await sql`DELETE FROM occupied_dates WHERE date = ${date}`;
      return { statusCode: 200, body: JSON.stringify({ message: 'Datum odstranjen' }) };
    } else {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
