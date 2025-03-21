import * as Notifications from "expo-notifications";

export async function sendNotification(expoPushToken: string, title: string, body: string) {
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-Encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: expoPushToken,
      sound: "default",
      title: title,
      body: body,
    }),
  });
}
