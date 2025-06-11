const WebSocket = require("ws");
const express = require("express");
const app = express();

// تنظیم آدرس WebSocket برای اتصال به OBS
const OBS_WS_URL = "ws://[fdfe:dcba:9876::1]:4455";

// بررسی وضعیت استریم OBS
app.get("/obs-status", (req, res) => {
  try {
    const obsSocket = new WebSocket(OBS_WS_URL);

    obsSocket.on("open", () => {
      console.log("✅ اتصال به OBS برقرار شد!");
      obsSocket.send(JSON.stringify({ requestType: "GetStreamingStatus", requestId: "1" }));
    });

    obsSocket.on("message", (data) => {
      try {
        const jsonResponse = JSON.parse(data);
        res.json({ streaming: jsonResponse.streaming });
      } catch (parseError) {
        console.error("❌ خطا در تجزیه JSON:", parseError);
        res.status(500).json({ error: "خطا در پردازش داده‌های OBS" });
      }
      obsSocket.close();
    });

    obsSocket.on("error", (err) => {
      console.error("❌ خطا در اتصال به OBS WebSocket:", err);
      res.status(500).json({ error: "خطا در اتصال به OBS", details: err.message });
    });
  } catch (generalError) {
    console.error("❌ خطای کلی:", generalError);
    res.status(500).json({ error: "مشکلی در اجرای درخواست پیش آمد" });
  }
});

// اجرای سرور روی پورت 3000
app.listen(3000, () => {
  console.log("🚀 سرور اجرا شد و منتظر درخواست‌های OBS است!");
});
