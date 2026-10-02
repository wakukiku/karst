import { test } from "node:test";
import assert from "node:assert/strict";
import { packStatus } from "../src/domain.mjs";
test("quantity, consumables, missing roles and day limits are included", () => {
  const p = [
    { id: "a", role: "pack", weight: 940, price: 12900 },
    { id: "b", role: "water", weight: 160, price: 2400 },
  ];
  const s = packStatus(
    p,
    [
      { id: "a", qty: 2 },
      { id: "b", qty: 1 },
    ],
    "day",
    1500,
  );
  assert.equal(s.total, 3540);
  assert.equal(s.over, true);
  assert.deepEqual(s.missing, []);
  assert.equal(s.cost, 28200);
  assert.equal(packStatus(p, [], "overnight", 0).missing.length, 4);
});
