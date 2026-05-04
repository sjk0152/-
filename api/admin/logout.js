const { setJson } = require("../_lib");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return setJson(res, 405, { message: "Method Not Allowed" });
  }
  res.setHeader(
    "Set-Cookie",
    "admin_auth=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; Secure"
  );
  return setJson(res, 200, { ok: true });
};
