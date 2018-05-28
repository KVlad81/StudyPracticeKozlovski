
const loadMoreButton = document.querySelector('.load-more-button');
loadMoreButton.addEventListener('click', () => {
	photoPostsController.reload(0, photoPostsController.posts.length + 10, {});
})

const loginButton = document.querySelector('.login-button');
loginButton.addEventListener('click', () => {
	if (loginButton.innerText === 'Login') {

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
function newPostListeners() {
	document.querySelector('.save-post').addEventListener('click', () => {
		const img = document.querySelector('.new-post-file').files[0];
		const descr = document.querySelector('.description').value;
		const tags = document.querySelector('.hashtags').value.split(' ');
		const id = String(++photoPostsController.currentId);
		let url = URL.createObjectURL(img);
		if (photoPostsController.addPhotoPost({
			author: photoPostsController.user,
			createdAt: new Date(),
			description: descr,
			hashTags: tags,
			id: id.toString(),
			likes: Array["17", "18"],
			photoLink: url,
		})) {
			console.log('added sucsessfully');
		}
		reloadMain();
	});

}

function editPostListeners(id, url) {
	document.querySelector('.save-post').addEventListener('click', () => {
		const img = document.querySelector('.new-post-file').files[0];
		if (img) {
			url = URL.createObjectURL(img);
		}
		const descr = document.querySelector('.description').value;
		const tags = document.querySelector('.hashtags').value.split(' ');
		if (photoPostsController.editPhotoPost(String(id), {
			description: descr,
			hashTags: tags,
			photoLink: url,
		})) {
			console.log('added sucsessfully');
		}
		reloadMain();
	});

}

function changePage(page, listeners, param) {
	eraseFeed();
	let id, link, description, hashTags;
	if (param) {
		id = param.id;
		link = param.link;
		description = param.description;
		hashTags = param.hashTags;
	}
	const feed = document.getElementsByClassName("feed")[0];
	if (param)
		feed.innerHTML = page(description, hashTags, link);
	else {
		feed.innerHTML = page();
	}
	listeners(id, link);
}

function eraseFeed() {
	const filters = document.getElementsByClassName("filters-wrapper")[0];
	filters.style.display = 'none';
	const feed = document.getElementsByClassName("feed")[0];
	feed.innerHTML = '';
}

function reloadMain(createdAt, author) {
	eraseFeed();
	const filters = document.getElementsByClassName("filters-wrapper")[0];
	filters.style.display = 'flex';
	photoPostsController.reload(0, 10, {createdAt, author});
	console.log('reload');
}

const filterButton = document.querySelector('.filter-button');

filterButton.addEventListener("click", (e) => {
	let nameFilter = document.querySelector('.name-filt').value || null;
	let date = document.querySelector('.date-filt').value || null;
	let dateFilter = (date) ? new Date(date) : null;
	if (dateFilter && nameFilter || !(dateFilter || nameFilter)) {
		reloadMain(dateFilter, nameFilter);
	} else {
		if (nameFilter) {
			photoPostsController.reload(0, photoPostsController.currentId, {
				author: nameFilter,
			});
		} else {
			photoPostsController.reload(0, photoPostsController.currentId, {
				createdAt: dateFilter,
			});
		}
	}
	e.preventDefault();
});