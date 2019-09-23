const app = require("./server");
const http = require("http");
const server = http.createServer(app);
const path = require("path");
const express = require("express");
// Set Variable called port according to "development" / "production"
if (process.env.NODE_ENV === "production") {
  app.set("port", process.env.PORT || 80);
} else {
  app.set("port", 8080);
}
if (process.env.NODE_ENV === "production") {
  // Express will serve up production assets
  // if not https redirect to https unless logging in using OAuth
  console.log("fallback line is called", path.join(__dirname, "../build"));
  app.use(express.static(path.join(__dirname, "../build")));
  app.get("*", (req, res) => {
    console.log("fall back route is being called");
    res.sendFile(path.join(__dirname + "/../build/index.html"));
  });
}

server.listen(app.get("port"), () => {
  console.log(`Listening on ${app.get("port")}`);
});
