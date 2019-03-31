const PROXY_CONFIG = [
    {
        context: [
            "/istio",
            "/coolstore.json"
        ],
        target: "http://localhost:8080",
        secure: false
    }
]

module.exports = PROXY_CONFIG;