// ClearPath lead capture — writes straight into this business's own GHL sub-account.
//
// Why this exists: the site embedded a GoHighLevel survey widget
// (survey/aHY4O6c5nBqcf9YdDcGi) that is NOT owned by location GxzOL4zGdrLvnVAylNSh.
// Submissions went somewhere the CRM for this business cannot see, and ClearPath
// recorded 0 leads across 30 days. The only form the location does own belongs to
// Iron Horse (it asks for vehicle make/model), so there was nothing correct to point
// the embed at. This endpoint replaces the widget entirely.
//
// Env (set on the clear-path-pueblo Vercel project):
//   GHL_TOKEN        private integration token scoped to the sub-account
//   GHL_LOCATION_ID  GxzOL4zGdrLvnVAylNSh

const GHL = "https://services.leadconnectorhq.com";

function clean(v, max = 300) {
  return String(v ?? "").trim().slice(0, max);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = process.env.GHL_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!token || !locationId) {
    console.error("lead: GHL_TOKEN or GHL_LOCATION_ID not configured");
    return res.status(500).json({ error: "Lead capture is not configured" });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});

  const name = clean(body.name, 120);
  const phone = clean(body.phone, 40);
  const email = clean(body.email, 120);
  const job = clean(body.job, 200);
  const address = clean(body.address, 200);
  const details = clean(body.details, 2000);

  // Phone is the one that matters for a same-day hauling job; email is optional.
  if (!name || !phone) {
    return res.status(400).json({ error: "Name and phone are required" });
  }

  const [firstName, ...rest] = name.split(/\s+/);
  const lastName = rest.join(" ");

  const notes = [
    job && `What needs hauling: ${job}`,
    address && `Address / area: ${address}`,
    details && `Details: ${details}`,
  ].filter(Boolean).join("\n");

  try {
    const r = await fetch(`${GHL}/contacts/upsert`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Version: "2021-07-28",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        locationId,
        firstName,
        lastName,
        name,
        phone,
        ...(email ? { email } : {}),
        source: "clearpathjunkremovalcolorado.com",
        tags: ["website-quote", "clearpath"],
        address1: address || undefined,
      }),
    });

    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      console.error("GHL upsert failed", r.status, JSON.stringify(data).slice(0, 400));
      return res.status(502).json({ error: "Could not save your request" });
    }

    const contactId = data?.contact?.id || data?.id;

    // The job details live in a note. Custom fields get overwritten by the next
    // submission; a note is an immutable record of what this person actually asked for.
    if (contactId && notes) {
      try {
        await fetch(`${GHL}/contacts/${contactId}/notes`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Version: "2021-07-28",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ body: notes }),
        });
      } catch (e) {
        console.error("note failed (lead still saved):", e);
      }
    }

    return res.status(200).json({ success: true, contactId });
  } catch (err) {
    console.error("lead error:", err);
    return res.status(500).json({ error: "Could not save your request" });
  }
}
