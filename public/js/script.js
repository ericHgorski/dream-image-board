// cannot user arrow functions here
(function () {
    // IMAGE-MODAL VUE COMPONENT
    Vue.component("image-modal", {
        template: "#template",
        props: ["id"],
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
        mounted: function () {
            this.getModal();
            // Event listener, clicks outside of modal will automatically close modal
            document.getElementById("overlay").addEventListener("click", function (e) {
                if (e.target !== this) return;
                location.hash = "";
            });
        },
        watch: {
            id: function () {
                this.getModal();
            },
        },
        methods: {
            getModal: function () {
                const self = this;
                axios
                    .get(`/image/${self.id}`)
                    .then(function ({ data }) {
                        self.image = data;
                    })
                    .catch(function (err) {
                        // self.$emit("close");
                        console.log("error in component get image/id axios request: ", err);
                    });
                axios
                    .get(`/get-comments/${this.id}`)
                    .then(function ({ data }) {
                        self.comments = data;
                    })
                    .catch(function (err) {
                        console.log("error in component get-comments axios request", err);
                    });
            },
            closeModal: function () {
                this.$emit("close"); // used with closeModal method in parent vue instance
            },
            addComment: function (e) {
                // Prevent refresh on form submission
                e.preventDefault();

                const self = this;
                let newComment = {
                    comment: this.comment,
                    commenter: this.commenter,
                };
                axios
                    .post(`post-new-comment/${this.id}`, newComment)
                    .then(function (resp) {
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
            selectedImage: location.hash.slice(1), // provides link sharing functionality via #
        },
        // When page loads, get image links from database and add them to data object to be rendered.
        mounted: function () {
            const self = this;
            axios.get("/images").then(function ({ data }) {
                self.images = data;
                self.infiniteScroll();
            });
            // When url is set to image id, change selectedImage value and launch corresponding modal
            window.addEventListener("hashchange", function () {
                self.selectedImage = location.hash.slice(1);
            });
        },
        methods: {
            handleClick: function (e) {
                // Prevent submit button from causing page refresh.
                e.preventDefault();
                const self = this;

                // FormData required because of file upload.
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);

                // Axios post request to send image data as response to be rendered by change to data images array.
                axios
                    .post("/upload", formData)
                    .then(function ({ data }) {
                        self.images.unshift(data);
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
                location.hash = "";
                this.selectedImage = null;
            },
            infiniteScroll: function () {
                var self = this;
                setTimeout(() => {
                    var lastImageId = self.images[self.images.length - 1].id;
                    if (window.innerHeight + window.scrollY + 200 >= document.body.offsetHeight && lastImageId > 1) {
                        axios.get(`/get-more-images/${lastImageId}`).then(function ({ data }) {
                            self.images.push(data);
                        });
                        self.infiniteScroll();
                    } else {
                        self.infiniteScroll();
                    }
                }, 500);
            },
        },
    });
})();
