const cron = require("node-cron");
const pool = require("../models/db");

const startCronJobs = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("Running course cleanup job...");

    try {
      const result = await pool.query(`
        DELETE FROM courses
        WHERE created_at < NOW() - INTERVAL '14 days'
        RETURNING *;
      `);

      console.log(`Deleted ${result.rowCount} old courses`);
    } catch (err) {
      console.log("CRON ERROR:", err.message);
    }
  });
};

module.exports = startCronJobs;