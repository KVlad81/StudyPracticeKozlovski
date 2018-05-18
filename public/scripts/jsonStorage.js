const fs = require('fs');

const jsonStorage = (function () {
    function compareDates(a, b) {
        return b.createdAt - a.createdAt;
    }
    return {
        init: function () {
            const posts = JSON.parse(fs.readFileSync('server/data/posts.json'));
            if (posts === null) {
                fs.writeFileSync(path, JSON.stringify([]));
                // localStorage.setItem("id", "11");
            }
        },
        getID: function () {
            let newID = JSON.parse(fs.readFileSync('server/data/id.json')).id + 1;
            let idstring = JSON.stringify(newID);
            fs.writeFileSync('server/data/id.json', JSON.stringify({ id: idstring }));
            return JSON.parse(newID);
        },
        pushPost: function (post) {
            let posts = JSON.parse(fs.readFileSync('server/data/posts.json'));;
            posts.forEach(element => {
                element.createdAt = new Date(element.createdAt);
            });
            posts.push(post);
            posts.sort(compareDates);

            let poststring = JSON.stringify(posts);
            fs.writeFileSync('server/data/posts.json', poststring);
        },
        getPosts: function () {
            let posts = JSON.parse(fs.readFileSync('server/data/posts.json'));
            console.log(posts);
            if (posts) {
                posts.forEach(element => {
                    element.createdAt = new Date(element.createdAt);
                });
            }
            console.log(posts);
            return posts;
        },
        savePosts: function (posts) {
            let poststring = JSON.stringify(posts);
            fs.writeFileSync('server/data/posts.json', poststring);
        }
    }
})();

module.exports = jsonStorage;