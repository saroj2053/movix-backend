import mongoose from "mongoose";
import colors from "colors";

const connectToMongoDB = async CONNECTION_STRING => {
  try {
    const conn = await mongoose.connect(CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(
      `Successfully connected to mongodb at ${conn.connection.host}`.bgMagenta
        .black
    );
  } catch (err) {
    console.log(err);
  }
};

export default connectToMongoDB;
