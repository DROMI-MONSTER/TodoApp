import mongoose from 'mongoose';

const connectDB = async (mongoUri) => {
    if (!mongoUri) throw new Error('No Uri Provided')
    const connection = await mongoose.connect(mongoUri);

    console.log(`MongoDB Connected: ${connection.connection.host}`);
    
    return connection;

}

export default connectDB