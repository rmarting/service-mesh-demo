const PROXY_CONFIG = [
    {
        context: [
            "/istio",
        ],
        target: "http://localhost:8080",
        secure: false
    },
    {
        context: [
            "/coolstore.json"
        ],
        target: "http://localhost:8090",
        secure: false
    }
]

module.exports = PROXY_CONFIG;