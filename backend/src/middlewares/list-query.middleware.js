export function validateListQuery(req, res, next) {
  const { page: rawPage, limit: rawLimit, search: rawSearch } = req.query;

  const page = rawPage === undefined ? 1 : Number(rawPage);
  const limit = rawLimit === undefined ? 10 : Number(rawLimit);

  if (!Number.isInteger(page) || page < 1) {
    return res.status(400).json({
      message: "Page phải là số nguyên lớn hơn hoặc bằng 1",
    });
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    return res.status(400).json({
      message: "Limit phải là số nguyên từ 1 đến 100",
    });
  }

  if (rawSearch !== undefined && typeof rawSearch !== "string") {
    return res.status(400).json({
      message: "Search phải là một chuỗi",
    });
  }

  const search = typeof rawSearch === "string" ? rawSearch.trim() : "";

  if (search.length > 100) {
    return res.status(400).json({
      message: "Search không được dài quá 100 ký tự",
    });
  }

  req.validatedQuery = {
    ...req.validatedQuery,
    page,
    limit,
    search,
  };

  next();
}
