// cannot user arrow functions here
(function () {
    new Vue({
        el: "#main",
        data: {
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
        },
        mounted: function () {
            var self = this;
            axios.get("/images").then(function (resp) {
                self.images = resp.data;
            });
        },
        methods: {
            handleClick: function (e) {
                e.preventDefault();
                var self = this;
                // Required because of file uploads
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);

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
                this.file = e.target.files[0];
            },
        },
    });
})();
