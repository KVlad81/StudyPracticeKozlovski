var photoPosts = [];

let func = (function (params) {
    function compareDates(a, b) {
        return b.createdAt - a.createdAt;
    }
    return {
        currentId: 0,

        createPhotoPost: function (description, createdAt, author, photoLink, hashTags, likes) {
            return {
                id: '' + this.currentId++,
                description: description,
                createdAt: createdAt,
                author: author,
                photoLink: photoLink,
                hashTags: hashTags,
                likes: likes,
            }
        },

        validateAuthor: function (author) {
            return typeof author === 'string' && author !== '';
        },
        validateHashtags: function (hashTags) {
            return hashTags instanceof Array && hashTags.every(function (hashTag) {
                return typeof hashTag === 'string';
            })
        },

        validateDescription: function (description) {
            return typeof description === 'string' && description.length < 200;
        },

        validatePhotoLink: function (photoLink) {
            return typeof photoLink === 'string' && photoLink !== '';
        },

        validateEditPost: function (editPost) {
            return (editPost.hasOwnProperty('description') && this.validateDescription(editPost.description)) ||
                (editPost.hasOwnProperty('hashTags') && this.validateHashtags(editPost.hashTags)) ||
                (editPost.hasOwnProperty('photoLink') && this.validatePhotoLink(editPost.photoLink)) ||
                !editPost.hasOwnProperty('description') &&
                !editPost.hasOwnProperty('hashTags') &&
                !editPost.hasOwnProperty('photoLink');

        },

        getPhotoPosts: function (skip = 0, top = 10, filterConfig) {
            if (arguments.length < 3) {
                return photoPosts.slice(skip, skip + top);
            } else {
                let extraPosts = photoPosts.slice(skip, skip + top).filter(function (post) {
                    return !((filterConfig.hasOwnProperty('author') &&
                        post.author !== filterConfig.author) ||
                        (filterConfig.hasOwnProperty('createdAt') &&
                            (!(filterConfig.createdAt instanceof Date) ||
                                filterConfig.createdAt >= post.createdAt)) ||
                        (filterConfig.hasOwnProperty('hashTags') &&
                            (!(filterConfig.hashTags instanceof Array) ||
                                !filterConfig.hashTags.every(function (hashTag) {
                                    return post.hashTags.includes(hashTag)
                                }))));
                });
                return extraPosts;
            }
        },

        getPhotoPost: function (id) {
            return photoPosts.find(function (element) {
                return element.id === id;
            })
        },

        getAuthors: function () {
            let authors = new Set();
            photoPosts.filter(post => {
                if (!authors.has(post.author))
                    authors.add(post.author);
            });
            return authors;
        },

        getHashtags: function () {
            let hashTags = new Set();
            photoPosts.filter(post => {
                post.hashTags.forEach(hashTag => {
                    if (!hashTags.has(hashTag))
                        hashTags.add(hashTag);
                });
            });
            return hashTags;
        },

        validatePhotoPost: function (post) {
            return (typeof post.id === 'string') &&
                this.validateDescription(post.description) &&
                this.validateCreatedAt(post.createdAt) &&
                this.validateAuthor(post.author) &&
                this.validatePhotoLink(post.photoLink) &&
                this.validateHashtags(post.hashTags);
        },

        addPhotoPost: function (post) {
            if (this.validatePhotoPost(post)) {
                photoPosts.push(post);
                photoPosts.sort(compareDates);
                return true;
            } else {
                return false;
            }
        },

        editPhotoPost: function (id, newPost) {
            let oldPost = this.getPhotoPost(id);
            if (oldPost !== undefined) {
                if (this.validateEditPost(newPost)) {
                    Object.assign(oldPost, newPost);
                    return true;
                }
            }
            return false;
        },

        removePhotoPost: function (id) {
            let index = photoPosts.findIndex(function (element) {
                return element.id === id;
            });
            if (index > -1) {
                photoPosts.splice(index, 1);
                return true;
            } else {
                return false;
            }
        },

        setLike: function (username, id) {
            let post = this.getPhotoPost(id);
            let userIndex = post.likes.findIndex(user => {
                return user === username;
            });
            if (userIndex === -1) {
                post.likes.push(username);
                return true;
            } else {
                post.likes.splice(userIndex, 1);
                return false;
            }
        },

        validateCreatedAt: function (createdAt) {
            return createdAt instanceof Date;
        },
    };
})()

for (let i = 2; i < 7; i++) {
    console.log(func.addPhotoPost(
        func.createPhotoPost('description of post #' + i,
            new Date('2018-02-' + parseInt(i / 2, 10)),
            'Author' + parseInt(i / 3, 10),
            'images/Pavel_Morozov.jpg',
            ['' + i, 'hashtag' + i],
            ['' + (i + 1), '' + (i + 2)]
        )
    )
    );
}
console.log(photoPosts);
window.posts = func;
/*
console.log('\n-func.getPhotoPosts')
console.log('top 10 posts:');
console.log(func.getPhotoPosts());
console.log('3 posts starting from the 3rd:');
console.log(func.getPhotoPosts(2, 3));
console.log('default 10 posts starting from 4:');
console.log(func.getPhotoPosts(4));
console.log('posts after filtering by date = 2018-02-5:');

let filterByDate = {
    createdAt: new Date('2018-02-05'),
};

console.log(func.getPhotoPosts(0, 12, filterByDate));
console.log('posts after filtering by author = Author4:');


let filterByAuthor = {
    author: 'Author4',
};

console.log(func.getPhotoPosts(2, 13, filterByAuthor));
console.log('posts after filtering by hashtag \'hashTag10\':');


let filterByTag = {
    hashTags: ['8'],
};

console.log(func.getPhotoPosts(filterByTag));

console.log('\n-getPhotoPost');
console.log('post with id 2:');
console.log(func.getPhotoPost('2'));
console.log('post with id 20:');
console.log(func.getPhotoPost('20'));

console.log('\n-validatePhotoPost');
console.log('valid post:');
console.log(func.validatePhotoPost({
    id: '1',
    description: '123',
    createdAt: new Date('2000-1-1'),
    author: 'Author',
    photoLink: 'link',
    hashTags: ['tag1', 'tag2'],
    likes: ['2'],
}));
console.log('with invalid createdAt:');
console.log(func.validatePhotoPost({
    id: '4',
    description: '123',
    createdAt: new Date('2020-01-01'),
    author: 'Author1',
    photoLink: 'link',
    hashTags: ['tag1', 'tag2'],
    likes: ['3']
}));

console.log('\n-addPhotoPost');
console.log('all posts: ');
console.log(photoPosts);
console.log('trying to add invalid post: ');
console.log(func.addPhotoPost({
    id: '4',
    createdAt: 4
}));
console.log('all posts: ');
console.log(photoPosts);
console.log('trying to add valid post: ');
console.log(func.addPhotoPost({
    id: '4',
    description: '123',
    createdAt: new Date('2008-8-8'),
    author: 'Alex',
    photoLink: 'link',
    hashTags: ['tag1', 'tag2'],
    likes: ['5'],
}));
console.log('all posts: ');
console.log(photoPosts);

console.log('\nfunction: editPhotoPost');
console.log('post with id 3 before editing:');
console.log(func.getPhotoPost('3'));
console.log('trying to edit post with id 3:');
console.log(func.editPhotoPost(
    '3',{ 
        photoLink: 'new link',
        description: ''
}));
console.log('post with id 3 after editing:');
console.log(func.getPhotoPost('3'));

console.log('trying to fail edit post with id 3:');
console.log(func.editPhotoPost(
    '3',{ 
        photoLink: 'new link',
        description: new Date(),
}));



console.log('\n-removePhotoPost');
console.log('removing post with id 3');
console.log(func.removePhotoPost('3'));
console.log('trying to get post with id 3');
console.log(func.getPhotoPost('3'));
*/
