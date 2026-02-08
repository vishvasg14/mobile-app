exports.parseContactInfo = (text) => {
  const emailMatch = text.match(
    /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi
  );

  const phoneMatch = text.match(
    /(\+?\d[\d\s\-]{8,}\d)/g
  );

  return {
    email: emailMatch ? emailMatch[0] : null,
    phone: phoneMatch ? phoneMatch[0] : null
  };
};
