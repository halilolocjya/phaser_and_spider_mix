/**
 *
 * @from https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions
 *
 * @des puppeteer用chromium打开网页，
 * 自动滚动到页面底部，
 * 然后截一张全屏，
 * 并点击一个按钮，
 * 关闭浏览器。
 * [puppeteer description]
 * @type {[type]}
 */
const puppeteer=require('puppeteer');
let url="https://www.hao123.com/"; //需要截取的页面
let path='hao123.png';//截取的图片放的位置
(async function(){
	try{
		console.log('start...')
		const browser=await puppeteer.launch({
      headless:false //这里我设置成false主要是为了让大家看到效果，设置为true就不会打开浏览器
 		});
		//打开新页面
		const page=await browser.newPage();
		await page.goto(url);
		// console.log(await page.content());

		//等待加载完毕
		// await page.waitForNavigation({
		// 	waitUntil:"load"
		// })

		console.log(await page.title());
		console.log(page.url());
    console.log('Scrolling through page');

//滚动到页面底部 node实现
    await scrollFunc(page);
    console.log('Finished scrolling');
		await sleep(2*1000)
		console.log('after out 1')
		// await sleep(20*1000)
		//生成截图
		await page.screenshot({path:path,fullPage:true});
		//NOTE Generating a pdf is currently only supported in Chrome headless.
		// await page.pdf({path: 'page.pdf', format: 'A4'});
		//点击按钮
		// await page.tap('#search')
		await browser.close();
	}catch(e){
		console.log(e)
	}

})();

var scrollFunc=function(page){
return	page.evaluate(async () => {
			await new Promise((resolve, reject) => {
					try {
							const maxScroll = Number.MAX_SAFE_INTEGER;
							let lastScroll = 0;
							const interval = setInterval(() => {
									window.scrollBy(0, 100);
									const scrollTop = document.documentElement.scrollTop;
									if (scrollTop === maxScroll || scrollTop === lastScroll) {
											clearInterval(interval);
											resolve();
									} else {
										lastScroll = scrollTop;
									}
							},100);//可以自己选择时间延长一点 这里规定为3S


					} catch (err) {
							console.log(err);
							reject(err.toString());
					}
			});
	});
}

var sleep = function (time) {
		return new Promise(function (resolve, reject) {
				setTimeout(function () {
						resolve();
				}, time);
		})
};
