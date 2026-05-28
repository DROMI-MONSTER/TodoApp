import mongoose from 'mongoose';

const connectDB = (mongoUri) => {
    if(!mongoUri) throw new Error('No Uri Provided')
    const connection = await mongoose.connect(mongoUri);

    return connection;

}

export default connectDB