import axios from "axios";

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
    console.log("error otp sending : ", error);
  }
}
export default otpSender;
