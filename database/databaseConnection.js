import mongoose from "mongoose";

export const dbConnection = () => {
    mongoose.connect(`${process.env.MONGODB_URI}/HospitalManagement`)
        .then((res) => {
            console.log(`mongodb connected!!`);
        }
        )
        .catch((error) => {
            console.log(`error while connecting to database ${error}`);
        }
        )
}

