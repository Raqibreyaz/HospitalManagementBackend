import mongoose from "mongoose";

export const dbConnection = async () => {

    try {

        let connection = await mongoose.connect(`${process.env.MONGODB_URI}/HospitalManagement`)

        // console.log('mongodb connected!! ', connection);
    } catch (error) {
        console.log(`error while connecting to database ${error}`);
    }
}
