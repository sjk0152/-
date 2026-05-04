const { setJson } = require("../_lib");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return setJson(res, 405, { message: "Method Not Allowed" });
  }
  const { password } = req.body || {};
  const adminPassword = process.env.ADMIN_PASSWORD || "1234";
  if (password !== adminPassword) {
    return setJson(res, 401, { message: "비밀번호가 올바르지 않습니다." });
  }
  const token = process.env.ADMIN_SESSION_TOKEN || "admin-session-ok";
  res.setHeader(
    "Set-Cookie",
    `admin_auth=${encodeURIComponent(token)}; HttpOnly; Path=/; Max-Age=28800; SameSite=Lax; Secure`
  );
  return setJson(res, 200, { ok: true });
};
