
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";




// here we are verifying the username while user inputs is username available or not ? 
// here we assigned usernameValidation yo username and usernameValidation is coming from signUpSchema


const UsernameQuerySchema = z.object({
   username : usernameValidation
})


export async function GET(request : Request) {
   await dbConnect();
	


	// how we will get the username ?
	// we will get that from url (searchParams) in the searchParams we will get the full url and from that we will filter the username


   try {


       const {searchParams} = new URL(request.url)
       const queryParam = {
           username : searchParams.get('username')
       }


       // zod validation+/
		//safeParse has builtin  async keyword


      const result = UsernameQuerySchema.safeParse(queryParam)


		// console.log(result)


      if(!result.success) {
       const usernameErrors = result.error.format().username?._errors || []
       return Response.json({
           success : false,
           message : usernameErrors?.length > 0 ? usernameErrors.join(',') : "Invaild query parameters"
                  
       },{status : 400 } )
      }


      const {username} = result.data
      const existingVerifiedUser = await UserModel.findOne({username, isVerified : true})


      if(existingVerifiedUser){


       return Response.json({
           success : false,
           message : "Username already belongs to someone...."
                  
       },{status : 400 } )
      
      }


      return Response.json({
       success : true,
       message : "Username available"
              
   },{status : 200 } )


  
      
   } catch (error) {
       console.log("Error in checking username", error);
       return Response.json(
           {
               success : false,
               message : "Error in checking username"
           },
           { status : 500}
       )
      
   }
}
