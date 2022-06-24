// More about Preview Mode: https://nextjs.org/docs/advanced-features/preview-mode

export default function handler(req, res) {
  res.setPreviewData({
    query: req.query,
  });
  res.redirect(req.query.slug);
}
