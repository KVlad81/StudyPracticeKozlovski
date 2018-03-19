(function() {

	class PhotoPostsController {

		constructor() {
			this.user = 'Vlad Kozlovsky';
			this.isLogIn = false;
			this.posts = [];
			this.feed = document.getElementsByClassName('feed')[0];
			this.setFiltersData();
		}

		showPhotoPostsElement() {
			let loadMore = this.feed.getElementsByClassName('base-button-style')[0];
			loadMore.parentNode.removeChild(loadMore);
			
			let hrs = this.feed.getElementsByClassName('emptyline');
			hrs[0].parentNode.removeChild(hrs[0]);
			hrs[0].parentNode.removeChild(hrs[0]);
			hrs[0].parentNode.removeChild(hrs[0]);
			hrs[0].parentNode.removeChild(hrs[0]);
			
			this.posts.forEach(post => this.feed.append(this.createPhotoPostElement(post)));

			let newLoadMore = document.createElement('button');
			newLoadMore.classList.add('base-button-style');
			newLoadMore.textContent = 'Load more'
			this.feed.append(newLoadMore);

			let hr = document.createElement('hr')
			hr.classList.add('emptyline');
			this.feed.append(hr);

			hr = document.createElement('hr')
			hr.classList.add('emptyline');
			this.feed.append(hr);
			
			hr = document.createElement('hr')
			hr.classList.add('emptyline');
			this.feed.append(hr);

			hr = document.createElement('hr')
			hr.classList.add('emptyline');
			this.feed.append(hr);

			this.setButtonsDisplay();
		}

		addPhotoPost(post) {
			if (window.posts.addPhotoPost(post)) {
				this.reload(0, this.posts.length);
			}
		}

		removePhotoPost(id) {
			if (window.posts.removePhotoPost(id)) {
				if (this.posts.some(post => post.id === id)) {
					this.reload(0, this.posts.length - 1);
				}
			}
		}

		editPhotoPost(id, post) {
			if (window.posts.editPhotoPost(id, post)) {
				this.posts.forEach(item => {
					if (item.id === id) {
						for (let key in post) {
							item[key] = post[key];
						}
						this.replaceDomPost(item);
					}
				});
			}
		}

		replaceDomPost(newPost) {
			let post = document.getElementById(newPost.id);
			post.parentNode.replaceChild(this.createPhotoPostElement(newPost), post);
			this.setButtonsDisplay();
		}

		downloadPhotoPosts(skip = 0, top = 10, filterConfig) {
			let extraPosts = window.posts.getPhotoPosts(skip, top, filterConfig);
			console.log(extraPosts);
			this.posts = this.posts.concat(extraPosts);
		}

		reload(skip, top, filterConfig) {
			this.posts = window.posts.getPhotoPosts(skip, top, filterConfig);
			this.deleteDomPosts();
			this.showPhotoPostsElement();
		}

		deleteDomPosts() {
			while(feed.firstChild) 
				feed.removeChild(feed.firstChild);
		}

		createPhotoPostElement(photoPost) {

			let post = document.createElement('div');
			post.setAttribute('id', photoPost.id);
			post.classList.add('post');
			
			let time = document.createElement('div');
			time.textContent = photoPost.createdAt.toString().split(' GMT')[0];
			time.classList.add('time');
			post.append(time);

			let img = document.createElement('img');
			img.setAttribute('height', '300px');
			img.setAttribute('width', '250px');
			img.setAttribute('src', photoPost.photoLink);
			post.append(img);			



			let toolbar = document.createElement('div');
			toolbar.classList.add('toolbar');

			img = document.createElement('img');
			img.classList.add('image-size');
			if (photoPost.likes.findIndex( user => {
				return user === this.username;
			}) !== -1) {
				img.setAttribute('src', 'images/star.png');	
			} else {
				img.setAttribute('src', 'images/star1.png');
			}
			
			toolbar.append(img);

			let likeText = document.createElement('span');
			likeText.textContent = 'Lyapota';
			toolbar.append(likeText);

			let author = document.createElement('div');
			author.classList.add('post-username');
			author.textContent = photoPost.author;
			toolbar.append(author);

			img = document.createElement('img');
			img.classList.add('image-size');
			img.setAttribute('src', 'images/img_83432.png');
			toolbar.append(img);
			post.append(toolbar);

			let descriptionBar = document.createElement('div');
			descriptionBar.classList.add('description-bar');

			let description = document.createElement('div');
			description.classList.add('description');
			description.textContent = photoPost.description;
			descriptionBar.append(description);

			let hashTags = document.createElement('div');
			hashTags.classList.add('hashtags');
			hashTags.textContent = photoPost.hashTags.join('');
			descriptionBar.append(hashTags);

			img = document.createElement('img');
			img.setAttribute('width', '7%')
			img.setAttribute('src', 'images/edit.png');
			descriptionBar.append(img);
			post.append(descriptionBar)
			

			return post;
		}

		logIn() {
			this.isLogIn = true;
			this.user = 'Vlad Kozlovsky';
			let username = document.getElementsByClassName('username')[0];
			let logIn = document.getElementsByClassName('base-button-style')[1];
			username.textContent = this.user;
			logIn.textContent = 'Log out';
			this.setButtonsDisplay();
		}

		logOut() {
			this.isLogIn = false;
			this.user = null;
			let username = document.getElementsByClassName('username')[0];
			let logIn = document.getElementsByClassName('base-button-style')[1];
			username.textContent = 'Guest';
			logIn.textContent = 'Log in'
			this.setButtonsDisplay();
		}

		setButtonsDisplay() {
			let newPostButton = document.getElementsByClassName('base-button-style')[0];
			newPostButton.style.display = this.isLogIn ? 'block' : 'none';

			var toolbars = document.body.querySelectorAll('.toolbar');
			var descriptionBars = document.body.querySelectorAll('.description-bar');
			toolbars.forEach(toolbar => {
				let imgs = toolbar.querySelectorAll('img');
				imgs.forEach(item => item.style.display = this.isLogIn ? 'block' : 'none'); 
			});
			descriptionBars.forEach(toolbar => {
				let imgs = toolbar.querySelectorAll('img');
				imgs.forEach(item => item.style.display = this.isLogIn ? 'block' : 'none'); 
			});
		}

		setLike(id) {
			let res = window.posts.setLike(this.user, id);
			let post = document.getElementById(id);
			let likeImages = post.getElementsByClassName('image-size')[0];
			if (res) {
				likeImages.setAttribute('src', 'images/star.png');
			} else {
				likeImages.setAttribute('src', 'images/star1.png');
			}
		}



		setFiltersData() {
			let authors = window.posts.getAuthors();
			let hashtags = window.posts.getHashtags();
			let authorsList = document.getElementById('authors-tip');
			let hashtagsList = document.getElementById('hashtags-tip');

			authors.forEach(author => {
				let option = document.createElement('option');
				option.setAttribute('value', author);
				authorsList.append(option);
			});

			hashtags.forEach(author => {
				let option = document.createElement('option');
				option.setAttribute('value', author);
				hashtagsList.append(option);
			});
		}
	}

	window.photoPostsController = new PhotoPostsController();
})();