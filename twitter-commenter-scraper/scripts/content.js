chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
	if (data.msg === 'do-scraping') {
		DoScrape();
	}
});

let timerId;
async function DoScrape(){
	//create a notifer element
	let notifer_el = document.createElement("div");
	notifer_el.style.zIndex = 999;
	notifer_el.style.backgroundColor = "#005993";
	notifer_el.style.color = "#ffffff";
	notifer_el.style.position = "fixed";
	notifer_el.style.left = "12px";
	notifer_el.style.top = "12px";
	notifer_el.style.width = "340px";
	notifer_el.style.fontSize = "14px";
	notifer_el.style.padding = "6px 10px 6px 10px";
	notifer_el.style.border = "5px solid rgb(255, 208, 0)";
	notifer_el.style.borderRadius = "7px";
	notifer_el.innerHTML = "Twitter Target Page Following Scraper (by v-User) </br> Scraping process started...";
	console.log("Scraping process started...");
	document.body.insertBefore(notifer_el, document.body.firstChild);

	var all_members_info = "";
	let dowhile = true;

	let article = document.querySelector("div[aria-label='Timeline: Conversation']");
	let commenterRows = document.querySelector("[data-testid=cellInnerDiv] article[data-testid=tweet] a[role=link][aria-hidden]:not([data-get])");
	if (article && commenterRows) {


		let el_href = "", black_list = "",uniqueCounter = 0;
		try {
			// تا وقتی true باشه این عمل انجام میشه -----------------
			while (dowhile) {
				let commenterRows = document.querySelector("[data-testid=cellInnerDiv] article[data-testid=tweet] a[role=link][aria-hidden]:not([data-get])");
				if (commenterRows){
					// اگر کامنتگذار data-get نداشت وجود داشت بیاد اسکرول کنه برای نمایش -----------------
					commenterRows.scrollIntoView();

					//300 میلی ثانیه زمان میبره تا کامنتگذارها لود بشه -----------------
					await wait(300);
					window.scrollTo(0, document.body.scrollHeight);

					el_href = commenterRows.getAttribute("href");
					if (!black_list.includes(el_href)){

						uniqueCounter+=1;
						const username = el_href.replaceAll("/","");
						const profile_link = `https://www.twitter.com${el_href}`

						const current_member_info = `Username: ${username}, Profile Link: ${profile_link}`;
						all_members_info += current_member_info + "\r\n";

						black_list = black_list + el_href;

						if (uniqueCounter > 499){
							throw new Error('break');
						}

					}
					commenterRows.setAttribute("data-get","1");
					console.log("ta inja OKKKK?");
				}else{
					dowhile = false;
				}
			}
		} catch (e) {
			if (e.message !== 'break') throw e;
		}


		const member_amount_info = `Found ${uniqueCounter} users`;
		console.log(member_amount_info);
		notifer_el.innerHTML = `Twitter Commenter Scraper (by v-User) </ br> Scraping process finished and found ${uniqueCounter} unique user.`;
		console.log("Scraping process finished.");

		let targetPage = document.querySelector("div[data-testid=Tweet-User-Avatar] a").getAttribute("href");
		targetPage = targetPage.slice(1);

		let fn = targetPage + "'s Post Commenters Scraped by vUser";

		fn = fn.replace(/[\/\\@?%*:|"<>.]/g, '');
		all_members_info=all_members_info.replace("#","-")
		//ذخیره ی فایل txt
		const uri = "data:text/plain;charset=utf-8," + all_members_info;
		let ea = document.createElement("a");
		ea.href = uri;
		ea.download = fn; //group name
		document.body.appendChild(ea);
		ea.click();
		// 	document.body.removeChild(ea);

	} else {
		//اگر بخش پست ها قابل مشاهده نبود و پیدا نشد ارور میده -----------------
		notifer_el.style.backgroundColor = "#005993";
		notifer_el.innerHTML = "Twitter Commenter Scraper (by v-User) </br> Error: Members list is not visible!";
		console.log("Error: Members list is not visible!");
	}
}

// ساخت فانکشن برای ایجاد مکث -----------------
function wait(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
