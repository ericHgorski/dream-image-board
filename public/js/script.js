// cannot user arrow functions here
(function () {
    // IMAGE-MODAL VUE COMPONENT
    Vue.component("image-modal", {
        template: "#template",
        props: ["postTitle", "id"],
        mounted: function () {
            var self = this;
            axios.get(`/image/${this.id}`).then(function (resp) {
                console.log("resp.data from axios get image info request: ", resp.data);
            });
            console.log("id in mounted of my component: ", this.id);
        },
        data: function () {
            return {
                image: {},
                comments: [],
                newComment: "",
                poster: "",
            };
        },
        methods: {
            closeModal: function () {
                console.log("i am emitting from the component... (child)");
                this.$emit("close");
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
            axios.get("/images").then(function (resp) {
                self.images = resp.data;
            });
        },
        methods: {
            handleClick: function (e) {
                // We don't want submit button to cause page refresh.
                e.preventDefault();
                var self = this;

                // FormData required here because of file upload.
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
