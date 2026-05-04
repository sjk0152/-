const { isAdmin, setJson, supabaseListSuggestions } = require("../_lib");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return setJson(res, 405, { message: "Method Not Allowed" });
  }
  if (!isAdmin(req)) {
    return setJson(res, 401, { message: "관리자 권한이 필요합니다." });
  }
  try {
    const rows = await supabaseListSuggestions();
    return setJson(res, 200, rows);
  } catch (error) {
    return setJson(res, 500, { message: "목록 조회 실패", detail: error.message });
  }
};
