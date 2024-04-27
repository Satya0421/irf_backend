import { z } from "zod";

const sendOtpSchema = z
  .object({
    phoneNumber: z
      .string({
        required_error: "Phone number is required.",
      })
      .trim()
      .regex(/^[0-9]{10}$/, {
        message: "Invalid phone number.",
      }),
  })
  .strict();

const otpSchema = z
  .object({
    otp: z
      .string({
        required_error: "Otp is required.",
        invalid_type_error: "otp should be of type string.",
      })
      .trim()
      .min(4, { message: "Invalid otp . Please provide 6 digit otp code." })
      .max(4, { message: "Invalid otp . Please provide 6 digit otp code." }),
    phoneNumber: z
      .string({
        required_error: "Phone number is required",
      })
      .trim()
      .regex(/^[0-9]{10}$/, {
        message: "Invalid phone number.",
      }),
  })
  .strict();

const userRegisterSchema = z
  .object({
    phoneNumber: z
      .string({
        required_error: "Phone number is required.",
      })
      .trim()
      .regex(/^[0-9]{10}$/, {
        message: "Invalid phone number.",
      }),
    fullName: z.string({ required_error: "Please provide full name." }),
    email: z
      .string({ required_error: "Please provide email." })
      .trim()
      .toLowerCase()
      .email({ message: "Please provide a valid email addess." }),
    gender: z.enum(["Male", "Female", "Others"], {
      message: "Please enter Option like Male ,Female or Others.",
    }),
    dateOfBirth: z.string({ required_error: "Please provide date of birth." }),
    panNumber: z
      .string({ required_error: "Please provide pan number." })
      .trim()
      .min(10, { message: "Pancard should be 10 characters." })
      .max(10, { message: "Pancard should be 10 characters." }),
    address: z.string({ required_error: "Please provide address." }).trim(),
  })
  .strict();

const adminLoginSchema = z.object({
  email: z
    .string({ required_error: "Please provide email address" })
    .trim()
    .toLowerCase()
    .email({ message: "Please provide a valid email addess." }),
  password: z
    .string({ required_error: "Please provide password" })
    .trim()
    .regex(/^\S+$/, "Password cannot contain whitespace characters")
    .min(6, { message: "password should be atleast 6 characters" })
    .max(15, { message: "password should not be more than 15 characters" }),
});
export { sendOtpSchema, otpSchema, userRegisterSchema, adminLoginSchema };
