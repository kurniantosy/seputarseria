var webPush = require("web-push");

const vapidKeys = {
  publicKey:
    "BB3v7M2HgNZ5jkbUvMFsk1ez7LmLzj5XuPultZdO0sxvStqb_L8hn08lrgNVMshjnYhyj62xVsdUGNKgVcNbL6I",
  privateKey: "tAygLFvhUc0R3FGybFvmetN_LIKBhtKDMEUtmkGIA5I",
};

webPush.setVapidDetails(
  "mailto:example@yourdomain.org",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);
var pushSubscription = {
  endpoint:
    "https://fcm.googleapis.com/fcm/send/d2jSuFwzMPc:APA91bHKpwe28YRaSg-ChqRFyqGA5jTxWhTnzjzr5upiRNRGK8PXTE26MVNROet7kmrMaMfCSwWzOgbtMAbKEf2qX6cjJ7daLHlJmTD7rfqgUkUDbx-mI7DhNEyUfmOjhSgDXmThflgq",
  keys: {
    p256dh:
      "BGLC6Z5JmmXlkyYlqk1e29UIcnvArL8FzL+j8LfgmguKYyj4wW08GQMqygzUYbSebIwgkcKjTgKqPXiQysrTBQY=",
    auth: "CrLvfTvuo6o5bSBNR8aZWg==",
  },
};
var payload = "Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!";

var options = {
  gcmAPIKey: "1061143182062",
  TTL: 60,
};
webPush.sendNotification(pushSubscription, payload, options);
