import { GoogleUserReceiverService } from "./google.service";

const getReceiver = (type: "google") => {
  return new GoogleUserReceiverService();
};

export const handler = async (
  event: Record<string, any>
): Promise<Record<string, any>> => {
  console.log(event);

  const receiver = getReceiver("google");

  const authHeaderValue = event.headers["Authorization"];
  const [, token] = authHeaderValue.split("Bearer ");

  try {
    const userInfo = await receiver.getUser(token);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
      },
      body: JSON.stringify(userInfo),
    };
  } catch (err) {
    console.error("User Service: getUser handler error:", err);
    return {
      statusCode: 400,
      headers: {
        "Content-type": "text/plain",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
      },
      body: `User Service: getUser handler error: ${err}`,
    };
  }
};
