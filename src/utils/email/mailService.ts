import axios from "axios";
import config from "../../../config";
import { activationTemplate, resetTemplate } from "./emailTemplate";
import queryString from "query-string";
// E-posta base url
const url =
  "https://graph.microsoft.com/v1.0/users/" + config.email.userID + "/sendMail";

// E-posta gönderme işlevi
export async function sendEmail(emailData: any): Promise<void> {
  try {
    await axios.post(url, emailData, {
      headers: {
        Authorization: `Bearer ${await microsoftGraphApiToken()}`,
        "Content-Type": "application/json",
      },
    });

    console.log("E-posta gönderildi");
  } catch (error) {
    console.error("E-posta gönderme hatası:", error);
  }
}
export async function sendActivationCodeByEmail(
  email: string,
  activationCode: string
): Promise<void> {
  const emailData = {
    message: {
      subject: "Wallet E-posta Aktivasyon Kodu",
      body: {
        contentType: "HTML",
        content: activationTemplate(activationCode),
      },
      toRecipients: [
        {
          emailAddress: {
            address: email,
          },
        },
      ],
    },
    saveToSentItems: false,
  };
  await sendEmail(emailData);
}

export async function sendResetCodeByEmail(
  email: string,
  resetCode: string
): Promise<void> {
  const emailData = {
    message: {
      subject: "Wallet Şifre Sıfırlama Kodu",
      body: {
        contentType: "HTML",
        content: resetTemplate(resetCode),
      },
      toRecipients: [
        {
          emailAddress: {
            address: email,
          },
        },
      ],
    },
    saveToSentItems: false,
  };
  await sendEmail(emailData);
}

export async function microsoftGraphApiToken() {
  try {
    const tokenRequestData = {
      grant_type: "client_credentials",
      client_id: config.email.clientId,
      client_secret: config.email.clientSecret,
      scope: "https://graph.microsoft.com/.default",
    };
    const tokenUrl = `https://login.microsoftonline.com/${config.email.tenantId}/oauth2/v2.0/token`;
    const formData = queryString.stringify(tokenRequestData);
    const response = await axios.post(tokenUrl, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const accessToken = response.data.access_token;
    return accessToken;
  } catch (error) {
    console.error("Access token request error:", error);
    throw error;
  }
}
