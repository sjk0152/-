const { isAdmin, supabaseListSuggestions } = require("../_lib");

function toCsvLine(fields) {
  return fields.map((f) => `"${String(f ?? "").replace(/"/g, '""')}"`).join(",");
}

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.end("Method Not Allowed");
    return;
  }
  if (!isAdmin(req)) {
    res.statusCode = 401;
    res.end("Unauthorized");
    return;
  }
  try {
    const rows = await supabaseListSuggestions();
    const header = ["번호", "등록일시", "제목 유형", "내용", "비교 내용", "관련 영역"];
    const lines = [toCsvLine(header)];
    rows.forEach((r, idx) => {
      lines.push(
        toCsvLine([
          idx + 1,
          r.created_at,
          r.category,
          r.content,
          r.compare_content,
          r.areas || "",
        ])
      );
    });
    const filename = `yuseon_suggestions_${Date.now()}.csv`;
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.end("\uFEFF" + lines.join("\n"));
  } catch (error) {
    res.statusCode = 500;
    res.end(`Export failed: ${error.message}`);
  }
};
