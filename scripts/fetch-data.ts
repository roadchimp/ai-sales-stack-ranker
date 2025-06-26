// Fetch and analyze the CSV data structure
async function fetchSalesData() {
  try {
    // Fetch current quarter data
    const currentQResponse = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/anon_current_q_v2-wxgQ1LsWLX6Roau9VEeh34UlO5b0Xc.csv",
    )
    const currentQData = await currentQResponse.text()

    // Fetch past quarter data
    const pastQResponse = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/anon_past_q-PluxVg5mowCRnTtKryKFjyLts2AU8Y.csv",
    )
    const pastQData = await pastQResponse.text()

    // Fetch enhanced pipeline data
    const pipelineResponse = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sales_pipeline_enhanced-QN53mUhlcI8NlJggZURSvj657KHRK3.csv",
    )
    const pipelineData = await pipelineResponse.text()

    console.log("Current Quarter Data Sample:")
    console.log(currentQData.split("\n").slice(0, 5).join("\n"))

    console.log("\nPast Quarter Data Sample:")
    console.log(pastQData.split("\n").slice(0, 5).join("\n"))

    console.log("\nPipeline Data Sample:")
    console.log(pipelineData.split("\n").slice(0, 5).join("\n"))

    return {
      currentQ: currentQData,
      pastQ: pastQData,
      pipeline: pipelineData,
    }
  } catch (error) {
    console.error("Error fetching data:", error)
  }
}

fetchSalesData()
