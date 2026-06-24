import "dotenv/config"
import app from './app.js';
import connectDB from './backend/common/config/config.js';

const connection = async () => {
    const port = process.env.VITE_PORT || 3000;
    const mongoUri = process.env.VITE_MONGODB_URI || 'mongodb://admin:password@localhost:27017/?authSource=admin'

    app.listen(port, () => {
        console.log(`app running in port-${port}`);
    })
    await connectDB(mongoUri)
}


connection().catch(err => {
    console.log(`Got an error while establishing a connection to server...,${err}`);
    process.exit(1)
})