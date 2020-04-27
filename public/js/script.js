// cannot user arrow functions here
(function () {
    // IMAGE-MODAL VUE COMPONENT
    Vue.component("image-modal", {
        template: "#template",
        props: ["postTitle", "id"],
        mounted: function () {
            console.log("this.id :>> ", this.id);
            var self = this;
            axios
                .get(`/image/${this.id}`)
                .then(function ({ data }) {
                    self.username = data.username;
                    self.title = data.title;
                    self.url = data.url;
                    self.description = data.description;
                    self.created_at = data.created_at;
                    console.log("resp.data from axios get image info request: ", data);
                })
                .catch(function (err) {
                    "error in component get image/id axios request: ", err;
                });
            axios
                .get(`/get-comments/${this.id}`)
                .then(function ({ data }) {
                    console.log("data.rows[0] :>> ", data);
                    self.comments = data;
                    console.log("response inside comments axios", data);
                })
                .catch(function (err) {
                    console.log("error in component get-comments axios request", err);
                });
        },
        data: function () {
            return {
                image: {},
                url: "",
                title: "",
                description: "",
                comments: [],
                username: "",
                created_at: "",
                comment: "",
                commenter: "",
            };
        },
        methods: {
            closeModal: function () {
                this.$emit("close"); // used with closeModal method in parent vue instance
            },
            addComment: function (e) {
                // Prevent refresh on form submission
                e.preventDefault();
                var self = this;
                let newComment = {
                    comment: this.comment,
                    commenter: this.commenter,
                };
                axios
                    .post(`post-new-comment/${this.id}`, newComment)
                    .then(function (resp) {
                        console.log("resp for axios post new comment :>> ", resp.data[0]);
                        self.comments.unshift(resp.data[0]);
                    })

                    .catch(function (err) {
                        console.log("error in post new comment axios request", err);
                    });
            },
        },
    });

    new Vue({
        el: "#main",
        data: {
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
            selectedImage: null,
        },
        // When page loads, get image links from database and add them to data object to be rendered.
        mounted: function () {
            var self = this;
            axios.get("/images").then(function ({ data }) {
                self.images = data;
            });
        },
        methods: {
            handleClick: function (e) {
                // We don't want submit button to cause page refresh.
                e.preventDefault();
                var self = this;

                // FormData required because of file upload.
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);

                // Axios post request to send image data as response to be rendered by change to data images array
                axios
                    .post("/upload", formData)
                    .then(function (resp) {
                        self.images.unshift(resp.data);
                    })
                    .catch(function (err) {
                        console.log("error in post /upload: ", err);
                    });
            },
            handleChange: function (e) {
                // Selects the file that was just uploaded.
                this.file = e.target.files[0];
            },
            closeModal: function () {
                console.log("Parent is now closing modal");
                this.selectedImage = null;
            },
        },
    });
})();
