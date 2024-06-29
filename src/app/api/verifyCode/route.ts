
import { z } from "zod";
import { verifySchema } from "@/schemas/verifySchema";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";


const verifyCodeSchema = z.object({
 verifyCode: verifySchema,
});


export async function POST(request: Request) {
 await dbConnect();


 try {
	
	//decodeURIComponent is nextjs keyword


   const { username, code } = await request.json();
   const decodedUsername = decodeURIComponent(username);


   const user = await UserModel.findOne({ username: decodedUsername });


   if (!user) {
     return Response.json(
       {
         success: false,
         message: "User not found",
       },
       { status: 500 }
     );
   }


	// how to verify code we have already got the user … then put this line to verify the code (user.verifyCode === code)


   const isCodeValid = user.verifyCode === code;


	// here we extending the verifyCode time frame by using ‘new Date’ || new Date(user.verifyCodeExpiry) > new Date();


   const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();


   if (isCodeValid && isCodeNotExpired) {
     user.isVerified = true;
     await user.save();


     return Response.json(
       {
         success: true,
         message: "User verified successfully",
       },
       { status: 200 }
     );
   } else if (!isCodeNotExpired) {
     return Response.json(
       {
         success: false,
         message:
           "Verification code expired please signup to continue the process....",
       },
       { status: 400 }
     );
   } else {
     return Response.json(
       {
         success: false,
         message: "Incorrect verification code please check...",
       },
       { status: 500 }
     );
   }
 } catch (error) {
   console.log("Error verifying user", error);
   return Response.json(
     {
       success: false,
       message: "Error verifying user",
     },
     { status: 500 }
   );
 }
}
