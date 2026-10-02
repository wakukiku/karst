export function packStatus(products, cart, trip = "overnight", extra = 0) {
  const required =
    trip === "day" ? ["pack", "water"] : ["pack", "shelter", "sleep", "water"];
  const valid = cart
    .map((l) => ({ p: products.find((p) => p.id === l.id), qty: l.qty }))
    .filter((l) => l.p && Number.isInteger(l.qty) && l.qty > 0);
  const weight = valid.reduce((s, l) => s + (l.p.weight || 0) * l.qty, 0);
  const total = weight + Math.max(0, Number(extra) || 0),
    limit = trip === "day" ? 3500 : 7000;
  return {
    required,
    missing: required.filter((r) => !valid.some((l) => l.p.role === r)),
    weight,
    total,
    limit,
    over: total > limit,
    cost: valid.reduce((s, l) => s + l.p.price * l.qty, 0),
  };
}
