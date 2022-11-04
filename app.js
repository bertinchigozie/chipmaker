const fs = require("fs");
const readline = require("readline");
const csv = require("fast-csv");
const crypto = require("crypto");
const JsonTocsv = require("objects-to-csv");

let csvData = [];

// Reading our csv from using the createReadStream()
const stream = fs
  .createReadStream("./HNGi9 CSV FILE - Sheet1.csv")
  .pipe(csv.parse({ headers: true })) //extractiing the header from the file
  .on("error", (error) => console.error(error)) //handling error
  .on("data", (row) => csvData.push(row)) //storing new read Data in our csvDAta
  .on("end", () => csvData)
  .forEach((el) => {
    const attributes = el.Attributes.split(";"); // getting our individual attributes

    let finalAttribute = [];
    let result = [];

    attributes.forEach((att) => finalAttribute.push(att)); //looping through the attributes

    for (let i = 0; i <= finalAttribute.length - 1; i++) {
      result.push(finalAttribute[i].split(":"));
    }

    // GENERATING AN HASH SHA256
    const hash = crypto
      .createHash("sha256")
      .update("./csvToJson.json")
      .digest("hex");

    //restructuring our output
    const newOutput = [
      {
        format: "CHIP-0007",
        name: el.Filename,
        description: el.Description,
        minting_tool: el["TEAM NAMES"],
        seneitive_content: false,
        series_number: +el["Series Number"],
        series_total: 420,
        attributes: [
          {
            trait_type: result[0][0],
            value: result[0][1],
          },
          {
            trait_type: result[1][0],
            value: result[1][1],
          },
          {
            trait_type: result[2][0],
            value: result[2][1],
          },
          {
            trait_type: result[3][0],
            value: result[3][1],
          },
          {
            trait_type: result[4][0],
            value: result[4][1],
          },
          {
            trait_type: result[5][0],
            value: result[5][1],
          },
          {
            trait_type: result[6][0],
            value: result[6][1],
          },
          {
            trait_type: "Friendship",
            value: 50,
            min_value: 0,
            max_value: 255,
          },
        ],
        UUID: el.UUID,
        HASH: hash,
      },
    ];

    // Writing out file to json
    fs.writeFileSync("./JSON-FOLDER/csvToJson.json", JSON.stringify(newOutput));

    // converting back to csv
    new JsonTocsv(newOutput).toDisk("./filename.output.csv");
  });
