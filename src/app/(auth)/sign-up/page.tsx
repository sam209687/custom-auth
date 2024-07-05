"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {Loader2} from "lucide-react"
import Link from "next/link";


// all the necessary imports


export default function RegisterPage() {


// To use debouncing technique we are storing the signup fields in useState and setting that to blank 


 const [username, setUsername] = useState("");
 const [email, setEmail] = useState("");
 const [phone, setPhone] = useState("");
 const [password, setPassword] = useState("");
 const [confirm_password, setconfirm_passwordassword] = useState("");

 const [UsernameMessage, setUsernameMessage] = useState("");
 const [isCheckingUsername, setIsCheckingUsername] = useState(false);
 const [isSubmitting, setIsSubmitting] = useState(false);


	// here we are using debounce linpm install usehooks-tsnpm install usehooks-tsbrary we installed, useDebounceCallback value set to setUsername after 300 millisecond 


 const debounced = useDebounceCallback(setUsername, 300);
 const { toast } = useToast();
 const router = useRouter();


	// This is use form-hook from react
	// form = variable
	// useForm = hook
	// z = zod
	// infer = deduct from the  signUpSchema
	// resolver = zod keyword
	// default value are setted to blank


 const form = useForm < z.infer < typeof signUpSchema > >({
   resolver: zodResolver(signUpSchema),
   defaultValues: {
     username: "",
     email: "",
     phone : "",
     password: "",
     confirm_password : "",
   },
 });


	// this is useEffect hook w
 useEffect(() => {	


 	// check if username present or not useEffect using syntax								
   const checkUsernameUnique = async () => {						     
if (username) {																								
       setIsCheckingUsername(true);


		// clear the previous messages stored


       setUsernameMessage("");


       try {


		// using axios to get username form check-username-unique api folder which earlier created


         const response = await axios.get(


			// back ticks are used /api/check-username-unique folder path and ? is refers to query params 


           `/api/check-username-unique?username=${username}`
         );
		// please console.log data 


         setUsernameMessage(response.data.message);
       } catch (error) {
         const axiosError = error as AxiosError<ApiResponse>;
         setUsernameMessage(
           axiosError.response?.data.message ?? "Error checking username"
         ); 
       } finally {
         setIsCheckingUsername(false);
       }
     }
   };
   checkUsernameUnique();
 }, [username]);


 const onsubmit = async (data: z.infer<typeof signUpSchema>) => {
   setIsSubmitting(true);


   try {
     const response = await axios.post<ApiResponse>("/api/sign-up", data);
     toast({
       title: "Success",
       description: response.data.message,
     });
     router.replace(`/verify/${username}`);
     setIsSubmitting(false);
   } catch (error) {
     console.error("Error in sign-up of user...", error);
     const axiosError = error as AxiosError<ApiResponse>;
     let errorMessage = axiosError.response?.data.message;


     toast({
       title: "Signup failed !!",
       description: errorMessage,
       variant: "destructive",
     });
     setIsSubmitting(false);
   }
 };


 return (
   <div className="flex justify-center items-center min-h-screen bg-gray-100">
     <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
       <div className="text-center">
         <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
           Join Mystery message !!{" "}
         </h1>
         <p className="mb-4">Signup to start anonymous adventure... </p>
       </div>
       <Form {...form}>
         <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-6">
           <FormField
             name="username"
             control={form.control}
             render={({ field }) => (
               <FormItem>
                 <FormLabel>Username</FormLabel>
                 <FormControl>
                   <Input
                     placeholder="username"
                     {...field}
                     onChange={(e) => {
                       field.onChange(e);
                       debounced(e.target.value);
                     }}
                   />
                  
                 </FormControl>
                 {
                       isCheckingUsername && <Loader2 className="animate-spin" />
                   }


                   <p className= {`text-sm ${UsernameMessage === "Username available" ? 'text-green-900' : 'text-red-800' }`}>
                       test {UsernameMessage}
                   </p>
                 <FormMessage />
               </FormItem>
             )}
           />


           {/* email form control goes here */}


           <FormField
             name="email"
             control={form.control}
             render={({ field }) => (
               <FormItem>
                 <FormLabel>Email</FormLabel>
                 <FormControl>
                   <Input placeholder="email" {...field} />
                 </FormControl>
                 <FormMessage />
               </FormItem>
             )}
           />

           {/* phone field goes here  */}

           <FormField
             name="phone"
             control={form.control}
             render={({ field }) => (
               <FormItem>
                 <FormLabel>Phone number</FormLabel>
                 <FormControl>
                   <Input placeholder="Phone" {...field} />
                 </FormControl>
                 <FormMessage />
               </FormItem>
             )}
           />


           {/* password fiels goes here */}


           <FormField
             name="password"
             control={form.control}
             render={({ field }) => (
               <FormItem>
                 <FormLabel>Password</FormLabel>
                 <FormControl>
                   <Input type="password" placeholder="password" {...field} />
                 </FormControl>
                 <FormMessage />
               </FormItem>
             )}
           />

           {/* confirm password field goes here */}

           <FormField
             name="confirm_password"
             control={form.control}
             render={({ field }) => (
               <FormItem>
                <FormControl>
                   <Input type="password" placeholder="Confirm password" {...field} />
                 </FormControl>
                 <FormLabel>Confirm Password</FormLabel>
                 
                 
               </FormItem>
             )}
           />



           <Button type="submit" disabled={isSubmitting}>
             {
               isSubmitting ? (
                 <>
                 <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait....
                 </>
               ) : ('Signup')
             }
           </Button>
         </form>
       </Form>
       <div className="tex text-center mt-4">
         <p>
           Already member?
           <Link href="/sign-in" className="text-blue-500 hover:text-blue-800">SignIn
           </Link>


         </p>


       </div>
     </div>
   </div>
  
  
 );
}
