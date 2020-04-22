// cannot user arrow functions here
(function () {
    new Vue({
        el: "#main",
        data: {
            images: [],
        },
        mounted: function () {
            var self = this;
            axios.get("/images").then(function (resp) {
                self.images = resp.data;
            });
        },
        methods: {
            myFunction: function () {
                console.log("function is running");
            },
        },
    });
})();
