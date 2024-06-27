import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  // api me data fetch karne ke liye hum request.json humne yeh batay hai ki humko username, email, password chaihiye {} = data destructring
  try {
    const { username, email, password } = await request.json();

    // UserModel ji humko us user ko dena  jiska username ho aur isVerified true ho
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    // Agar humko existingUserVerifiedByUsername mil jata hai to Response.json app false ho jao kunki is username par already entry ho chuki hai.
    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "username already exists",
        },
        { status: 400 }
      );
    }

    // ab hum phir se yeh check karege ki yedi email ke through koi user milta hai to
    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      // agar user exists karta hai email se natdo ki  user already exists
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists by this email",
          },
          { status: 400 }
        );

        // Agar user email se exists nahi karta hai to password ko hashed kar diya aur user ke password ko hashed password ke barabar kar diya hai
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }

      // is else part me  user matlab ayya hi pheli baar hai to uska password encrypt kardo aur us user ko register kar do
    } else {
      // is line me humne password ko encrypt kar diya hai
      const hashedPassword = await bcrypt.hash(password, 10);
      // expiryDate ko humene User schema se liya hai
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      // Is me hum UserModel ke instance jo mongoose schema me create kiye hai usiko hum yaha modify karke save kar rehe hai.
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        isVerified: false,
        verifyCodeExpiry: expiryDate,
        products: [],
      });

      await newUser.save();
    }

    // Ab hum user ko verification email send karna hoga kunki user ka instance DB me save ho chuka hai

    const emailResponse = await sendVerificationEmail(
      username,
      email,
      verifyCode
    );
    // Ab agar hume emailResponse me success ka flag nahi mita hai to
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );

      return Response.json(
        {
          success: true,
          message: "User registered successfully.. Please verify your email",
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error registring user", error);
    return Response.json(
      {
        success: false,
        message: "Error registring user",
      },
      { status: 500 }
    );
  }
}
