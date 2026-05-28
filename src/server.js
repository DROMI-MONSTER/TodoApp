import createApp from './app.js';
import connectDB from './backend/common/config/config';

const connection = async () => {
    const port = import.meta.env.VITE_PORT || 3000;
    const mongoUri = import.meta.env.VITE_MONGODB_URI ||'mongodb://localhost:27017/candy_todo'

    const app = createApp();
    app.listen(port, () => {
        console.log(`app running in port-${port}`);
    })
    await connectDB(mongoUri)
}


connection().catch(err => {
    console.log(`Got an error while establishing a connection to server...`);
    process.exit(1)
})