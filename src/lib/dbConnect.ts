import mongoose from "mongoose";

// why ? this
// here ? (Yes or No) means optional weather the connection may opened or closed
// This is also a typescript methos from which we are saying to mongo that isConnected ? : number … whenever the connection of backend and DB connects
//It will give a number like 0 || 1 


type ConnectionObject = {
   isConnected ? : number
}


const connection : ConnectionObject = {}


// create the connection with db 
// async means = managing the delayed time
// dbConnect = function name
// :Promise = typescript
// <void> = the data which in future may be whatever (number, boolean, string etc)


async function dbConnect():Promise <void> {
   // checking the db is already connected or not


   if (connection.isConnected) {
       console.log("Db already connected");
       return
      
   }


   // creating connection to DB


   try {


       const db = await mongoose.connect( process.env.MONGODB_URL || '', {} )


       connection.isConnected = db.connections[0].readyState;
       console.log("DB connected successfully !!");
      


      
   } catch (error) {


       console.log("DB connection failed" ,error);
       process.exit(1);
      
      
   }
  }


export default dbConnect;