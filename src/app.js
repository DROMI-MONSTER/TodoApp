import express from 'express'


function createApp() {
    const app = express()
    app.use(express.json())
    return app
}
export default createApp