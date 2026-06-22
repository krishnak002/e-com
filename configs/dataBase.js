import mongoose from 'mongoose'

const db = async()=>{
    
    url = process.env.MONGODB_URL || 3000;
    
    try {
        await mongoose.connect(url)
        console.log("database Connected");
        
    } catch (error) {
        console.log(error.message);
        
    }
}
export default db;