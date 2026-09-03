async function test() {
  try {
    const res = await fetch("http://localhost:3005/api/v1/requests/PR-2026-88101/lifecycle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "QUOTES_SUBMITTED",
        quotations: [
          {
            vendorName: "Jarir Marketing Co.",
            totalPrice: 47000,
            unitPrice: 4700,
            leadTimeDays: 3,
            specificationsText: "Official Dell KSA Authorized Stock",
            warrantyTerms: "36 Months ProSupport",
            isChosen: true,
          },
        ],
      }),
    });
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Response data:", data);
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

test();
