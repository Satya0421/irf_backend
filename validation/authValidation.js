import { z } from "zod";

const sendOtpSchema = z
  .object({
    phoneNumber: z
      .string({
        required_error: "Phone number is required",
      })
      .trim()
      .regex(/^91[0-9]{10}$/, {
        message:
          "Invalid phone number format. Please provide a valid Indian phone number starting with '91' and containing 12 digits.",
      }),
  })
  .strict();

const otpSchema = z
  .object({
    otp: z
      .string({
        required_error: "Otp is required",
        invalid_type_error: "otp should be of type string",
      })
      .trim()
      .min(6, { message: "Invalid otp . Please provide 6 digit otp code" })
      .max(6, { message: "Invalid otp . Please provide 6 digit otp code" }),
    phoneNumber: z
      .string({
        required_error: "Phone number is required",
      })
      .trim()
      .regex(/^91[0-9]{10}$/, {
        message:
          "Invalid phone number format. Please provide a valid Indian phone number starting with '91' and containing 12 digits.",
      }),
  })
  .strict();

const userRegisterSchema = z
  .object({
    phoneNumber: z
      .string({
        required_error: "Phone number is required",
      })
      .trim()
      .regex(/^91[0-9]{10}$/, {
        message:
          "Invalid phone number format. Please provide a valid Indian phone number starting with '91' and containing 12 digits.",
      }),
    fullName: z.string({ required_error: "Please provide full name" }),
    email: z
      .string({ required_error: "Please provide email" })
      .trim()
      .toLowerCase()
      .email({ message: "Please provide a valid email addess" }),
    gender: z.enum(["Male", "Female", "Others"], {
      message: "Please enter Option like Male ,Female or Others",
    }),
    dateOfBirth: z.string({ required_error: "Please provide date of birth" }),
    panNumber: z
      .string({ required_error: "Please provide pan number" })
      .trim()
      .min(10, { message: "Pancard should be 10 characters" })
      .max(10, { message: "Pancard should be 10 characters" }),
    address: z.string({ required_error: "Please provide address" }).trim(),
  })
  .strict();
export { sendOtpSchema, otpSchema, userRegisterSchema };
