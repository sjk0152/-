const { supabaseInsertSuggestion, setJson } = require("./_lib");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return setJson(res, 405, { message: "Method Not Allowed" });
  }

  try {
    const { category, content, compareContent, areas } = req.body || {};
    if (!category || !content || !compareContent) {
      return setJson(res, 400, { message: "제목, 내용, 비교 내용은 필수입니다." });
    }
    const areaText = Array.isArray(areas) ? areas.join(", ") : "";

    await supabaseInsertSuggestion({
      category,
      content,
      compare_content: compareContent,
      areas: areaText,
      created_at: new Date().toISOString(),
    });
    return setJson(res, 200, { ok: true });
  } catch (error) {
    return setJson(res, 500, { message: "저장 중 오류가 발생했습니다.", detail: error.message });
  }
};
