import cron from 'node-cron';

// 每分钟执行一次
cron.schedule('* * * * *', () => {
  console.log('Running every minute');
});
