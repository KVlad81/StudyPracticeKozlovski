const locStorage = (function () {
    function compareDates(a, b) {
        return b.createdAt - a.createdAt;
    }
    return {
        init: function () {
            const jsonPosts = JSON.stringify([]);
            console.log(jsonPosts);
            if (localStorage.getItem("posts") === null) {
                localStorage.setItem("posts",[]);
                // localStorage.setItem("id", "11");
            }    
        },
        getID: function () {
            let newID = JSON.parse(localStorage.getItem("id")) + 1;
            let idstring = JSON.stringify(newID);
            localStorage.setItem("id", idstring);
            return JSON.parse(localStorage.getItem("id"));
        },
        pushPost: function (post) {
            let posts = JSON.parse(localStorage.getItem("posts"));
            posts.forEach(element => {
                element.createdAt = new Date(element.createdAt);
            });
            posts.push(post);
            posts.sort(compareDates);

            let poststring = JSON.stringify(posts);
            localStorage.setItem("posts", poststring);
        },
        getPosts: function () {
            let posts = JSON.parse(localStorage.getItem("posts"));
            if (posts) {
                posts.forEach(element => {
                    element.createdAt = new Date(element.createdAt);
                });
            }
            return posts;
        },
        savePosts: function (posts) {
            let poststring = JSON.stringify(posts);
            localStorage.setItem("posts", poststring);
        }
    }
})();
locStorage.init();