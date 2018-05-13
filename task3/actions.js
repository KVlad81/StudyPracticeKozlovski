const loadMoreButton = document.querySelector('.load-more-button');
loadMoreButton.addEventListener('click', () => {
	photoPostsController.reload(0, photoPostsController.posts.length + 10, {});
})

const loginButton = document.querySelector('.login-button');
loginButton.addEventListener('click', () => {
	if(loginButton.innerText === 'Login'){
		photoPostsController.logIn();
		console.log('login');
	} else {
		photoPostsController.logOut();
		console.log('logout');
	}
})

const newPostButton = document.querySelector('.new-post-button');
newPostButton.addEventListener('click', () => {
	changePage(newPostPage, newPostListeners);
})
function newPostListeners(){
	document.querySelector('.save-post').addEventListener('click', () => {
		const input = document.querySelector('.new-post-file');
		const descr = document.querySelector('.description').value;
		const tags = document.querySelector('.hashtags').value.split(' ');
		console.log(input);
		console.log(descr);
		console.log(tags);
		posts.addPhotoPost( { author: photoPostsController.user,
		createdAt: new Date(),
		description: descr,
		hashTags: tags,
		id: posts.currentId++,
		likes: Array [ "17", "18" ],
		photoLink: input.value,
		});
		console.log('working');
		reloadMain();	
	});

}

function changePage(page, listeners){
	eraseFeed();
	const feed = document.getElementsByClassName("feed")[0];
	feed.innerHTML = page;
	listeners();
}

function eraseFeed(){
	const filters = document.getElementsByClassName("filters-wrapper")[0];
	filters.style.display = 'none';
	const feed = document.getElementsByClassName("feed")[0];
	feed.innerHTML = '';
}

function reloadMain(){
	eraseFeed();
	const filters = document.getElementsByClassName("filters-wrapper")[0];
	filters.style.display = 'flex';
	photoPostsController.reload(0, 10, {});
	console.log('reload');
}