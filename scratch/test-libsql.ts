import { createClient } from "@libsql/client";
import path from "path";

async function test() {
  const url = `file:${path.join(process.cwd(), 'dev.db').replace(/\\/g, '/')}`;
  console.log("Testing LibSQL connection to:", url);
  try {
    const client = createClient({ url });
    const result = await client.execute("SELECT 1 as test");
    console.log("Success! LibSQL result:", result.rows);
    process.exit(0);
  } catch (error) {
    console.error("LibSQL failed:", error);
    process.exit(1);
  }
}

test();
