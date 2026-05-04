function getEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
}

function getSupabaseConfig() {
  return {
    url: getEnv("SUPABASE_URL"),
    serviceRoleKey: getEnv("SUPABASE_SERVICE_ROLE_KEY"),
  };
}

async function supabaseInsertSuggestion(payload) {
  const { url, serviceRoleKey } = getSupabaseConfig();
  const endpoint = `${url}/rest/v1/suggestions`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase insert failed: ${text}`);
  }
}

async function supabaseListSuggestions() {
  const { url, serviceRoleKey } = getSupabaseConfig();
  const endpoint =
    `${url}/rest/v1/suggestions` +
    "?select=id,category,content,compare_content,areas,created_at&order=created_at.desc";
  const res = await fetch(endpoint, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase list failed: ${text}`);
  }
  return res.json();
}

function parseCookies(req) {
  const cookieHeader = req.headers.cookie || "";
  const pairs = cookieHeader.split(";").map((v) => v.trim()).filter(Boolean);
  const out = {};
  pairs.forEach((pair) => {
    const i = pair.indexOf("=");
    if (i <= 0) return;
    const k = pair.slice(0, i).trim();
    const v = pair.slice(i + 1).trim();
    out[k] = decodeURIComponent(v);
  });
  return out;
}

function isAdmin(req) {
  const token = process.env.ADMIN_SESSION_TOKEN || "admin-session-ok";
  const cookies = parseCookies(req);
  return cookies.admin_auth === token;
}

function setJson(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

module.exports = {
  supabaseInsertSuggestion,
  supabaseListSuggestions,
  isAdmin,
  setJson,
};
