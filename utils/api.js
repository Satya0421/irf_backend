import axios from "axios";
import AppError from "./appError.js";

//Fas2SmsApi

async function otpSender(data) {
  try {
    const response = await axios.post("https://www.fast2sms.com/dev/bulkV2", data, {
      headers: {
        Authorization: process.env.FAST2SMS_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.log("error otp sending : ", error?.response?.data?.message);
    throw new AppError(`${error?.response?.data?.message || "otp senting error"}`, 500);
  }
}
export default otpSender;
