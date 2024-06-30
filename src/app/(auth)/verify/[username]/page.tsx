"use client";
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { verifySchema } from '@/schemas/verifySchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation'
import { title } from 'process';
import React from 'react'
import { useForm } from 'react-hook-form';
import * as z  from 'zod';


export default function VerifyAccount() {


 // firstly we need a router


 const router = useRouter();
     // how we are going to verify the account of user


 // options  to get data from params by useParams hook


 const params = useParams < { username : string } > ()
 const {toast} = useToast()


 const form = useForm <z.infer < typeof verifySchema > >({
   resolver : zodResolver(verifySchema),
  
 })


 const onSubmit = async (data : z.infer< typeof verifySchema >) => {


   try {
     const response = axios.post(`/api/verify-code`, {
       username : params.username,
       code : data.code
     })


     toast({
       title : "success",
       description : (await response).data.message
     })
     router.replace('/sign-in')
    
   } catch (error) {
     console.log("Error in verifying user", error);
     const axiosError = error as AxiosError<ApiResponse>
     let errorMessage = axiosError.response?.data.message
     toast({
       title: "Sign-up failed",
       description : errorMessage,
       variant : "destructive"
     })
    
   }
 }
 return (


   <div className="flex justify-center items-center min-h-screen bg-gray-100">
     <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
       <div className="text-center">
         <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
           Verify Email !!
         </h1>
         <p className="mb-4">Verification needs a secondsss... </p>


       </div>


       <Form {...form}>
     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
       <FormField
       name ="code"
         control={form.control}
         render={({ field }) => (
           <FormItem>
             <FormLabel>Verification Code</FormLabel>
             <FormControl>
               <Input placeholder="code" {...field} />
             </FormControl>
            
           </FormItem>
         )}
       />
       <Button type="submit">Submit</Button>
     </form>
   </Form>


       </div>
       </div>
 )
}
