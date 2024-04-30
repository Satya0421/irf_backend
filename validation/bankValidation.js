import { z } from "zod";
const bankDetailsSchema = z.object({
  accountHolderName: z.string({ required_error_message: "account holder name is required" }).trim(),
  bankName: z.string({ required_error: "bank name is required" }).trim(),
  accountNumber: z
    .string({ required_error: "account number is required" })
    .trim()
    .min(9, { message: "account number should contain atleast 9 characters" })
    .max(12, { message: "account number should not contain more than 12 characters" }),
  ifscCode: z
    .string({ required_error: "ifsc code is required" })
    .trim()
    .min(11, { message: "ifsc code should contain 11 characters" })
    .max(11, { message: "ifsc code should contain 11 characters" }),
  upiId: z
    .string({ required_error: "upi id is required" })
    .trim()
    .min(3, { message: "upi id should conatin minimum 3 characters" })
    .max(50, { message: "upi id should not contain maximum 50 characters" }),
});

export { bankDetailsSchema };
