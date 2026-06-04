export async function cleanupSbi(sbi) {
  console.log(`Cleaning SBI ${sbi}...`);

  const response = await fetch(`http://ahwr-application-backend:3001/api/cleanup?sbi=${sbi}`, {
    method: "DELETE",
    headers: {
      "x-api-key": process.env.BACKOFFICE_UI_API_KEY,
    },
  });

  if (response.status !== 204) {
    const body = await response.text();
    throw new Error(`Cleanup failed for SBI ${sbi} (HTTP ${response.status}): ${body}`);
  }

  console.log(`Successfully cleaned up SBI ${sbi}`);
}
