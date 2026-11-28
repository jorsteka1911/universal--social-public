// Public capability discovery only. No provider calls or billing.
export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({error:"method_not_allowed"});
  }
  return res.status(200).json({
    schemaVersion: 1,
    sceneGeneration: {available:false, reason:"provider_not_connected"},
    imageAnimation: {available:false, reason:"provider_not_connected"},
    automaticNarration: {available:false, reason:"provider_not_connected"},
    billingEnabled:false
  });
}
