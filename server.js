const WebSocket = require("ws"); // نصب WebSocket برای اتصال به OBS
const express = require("express"); // نصب Express برای مدیریت درخواست‌ها
const app = express();

const OBS_WS_URL = "ws://127.0.0.1:4455"; // اگر IP متفاوت هست، مقدار رو تغییر بده

app.get("/obs-status", (req, res) => {
  const obsSocket = new WebSocket(OBS_WS_URL);

  obsSocket.on("open", () => {
    console.log("✅ اتصال به OBS برقرار شد!");
    obsSocket.send(JSON.stringify({ requestType: "GetStreamingStatus", requestId: "1" }));
  });

  obsSocket.on("message", (data) => {
    const jsonResponse = JSON.parse(data);
    res.json({ streaming: jsonResponse.streaming });
    obsSocket.close();
  });

  obsSocket.on("error", (err) => {
    res.status(500).json({ error: "❌ خطا در اتصال به OBS WebSocket", details: err.message });
  });
});

app.listen(3000, () => {
  console.log("🚀 سرور اجرا شد و منتظر درخواست‌های OBS است!");
});
