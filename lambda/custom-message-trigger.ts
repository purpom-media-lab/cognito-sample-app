type HandlerArguments = {
  triggerSource: string;
  userPoolId: string;
  userName?: string;
  request: {
    codeParameter: string;
    usernameParameter: string;
    userAttributes: {
      email_verified: string;
      email: string;
    };
  };
  response: {
    smsMessage: string | null;
    emailMessage: string | null;
    emailSubject: string | null;
  };
};

type CognitoCustomMessageResponse = {
  response: {
    smsMessage: string | null;
    emailMessage: string | null;
    emailSubject: string | null;
  };
} | null;

// ------------------------------------------------------------

export const handler = async (
  event: HandlerArguments
): Promise<CognitoCustomMessageResponse> => {
  if (!event.triggerSource) {
    console.error("missing triggerSource parameter");
    const e = new Error("internal server error");
    throw e;
  }

  try {
    switch (event.triggerSource) {
      case "CustomMessage_AdminCreateUser": {
        const url =
          `https://${process.env["DOMAIN"]}/new-password-setting`;
        event.response.emailMessage = `
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━<br>
            管理者から招待されました<br>
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━<br>
            以下のリンクの遷移先から必要項目を入力の上、パスワードの再設定をお願いします。<br>
            <br>
            メールアドレス: ${event.request.usernameParameter}<br>
            仮パスワード: ${event.request.codeParameter}<br>
            <br>
            ${url}<br>
            <br>
            認証コードの有効期限は7日間になります。<br>
            期限を過ぎると記載のURLから登録できなくなるのでご注意ください。<br>
            <br>
            `;
        event.response.emailSubject = "アカウント招待のお知らせ";
        break;
      }

      /// ... other cases
      default:
        break;
    }
    return event;
  } catch (e) {
    console.error("Failed to custom message");
    return event;
  }
};
