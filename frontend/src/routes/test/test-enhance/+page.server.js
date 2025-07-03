import { fail } from '@sveltejs/kit';

// 在文件顶部定义共用函数
const getCurrentTimeData = () => {
	return {
		time: new Date().toLocaleString('zh-CN')
	};
};

export const load = async () => {
	return {
		data: { ...getCurrentTimeData(), number: '42', message: 'Hello, world!' }
	};
};

export const actions = {
	testEnhance: async () => {
		const result = await new Promise((resolve) => {
			// 使用await等待异步操作完成,模拟阻塞。
			setTimeout(() => {
				console.log('到时间了，发给前端');
				resolve(getCurrentTimeData()); // resolve相当于return， 传给 result 的值
			}, 500);
		});
		if (Math.random() > 0.5) {
		    return  { success: true, message: '提交成功（一半概率）', ...result } ;
		} else {
		    return fail(500, { message: '提交失败（一半概率）', ...result });
		}
		// return { success: true, message: '提交成功（100%概率）', ...result };
		// return fail(500, { message: '测试错误', ...result });
		// throw new Error(`测试错误 ${result}`);
	}
};
