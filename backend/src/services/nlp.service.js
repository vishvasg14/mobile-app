exports.categorize = (text) => {
  const t = text.toLowerCase();

  if (t.includes("developer") || t.includes("software")) return "Tech";
  if (t.includes("marketing") || t.includes("sales")) return "Sales";
  if (t.includes("law") || t.includes("legal")) return "Legal";
  if (t.includes("finance") || t.includes("account")) return "Finance";

  return "General";
};
