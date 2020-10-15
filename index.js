const { X12Generator, X12Parser, X12TransactionMap } = require("node-x12");

// Parse valid ASC X12 EDI into an object.
const parser = new X12Parser(true);
let interchange = parser.parse("...raw X12 data...");

// Parse a stream of valid ASC X12 EDI
const ediStream = fs.createReadStream("someFile.edi");
const segments = [];

ediStream
  .pipe(parser)
  .on("data", (data) => {
    segments.push(data);
  })
  .on("end", () => {
    interchange = parser.getInterchangeFromSegments(segments);
  });

// Generate valid ASC X12 EDI from an object.
const jsen = {
  options: {
    elementDelimiter: "*",
    segmentTerminator: "\n",
  },
  header: [
    "00",
    "",
    "00",
    "",
    "ZZ",
    "10000000",
    "01",
    "100000000",
    "100000",
    "0425",
    "|",
    "00403",
    "100748195",
    "0",
    "P",
    ">",
  ],
  functionalGroups: [...etc],
};
const generator = new X12Generator(jsen);

// Query X12 like an object model
const engine = new X12QueryEngine();
const results = engine.query(interchange, 'REF02:REF01["IA"]');

results.forEach((result) => {
  // Do something with each result.
  // result.interchange
  // result.functionalGroup
  // result.transaction
  // result.segment
  // result.element
  // result.value OR result.values
});

// Map transaction sets to javascript objects
const map = {
  status: "W0601",
  poNumber: "W0602",
  poDate: "W0603",
  shipto_name: 'N102:N101["ST"]',
  shipto_address: 'N1-N301:N101["ST"]',
  shipto_city: 'N1-N401:N101["ST"]',
  shipto_state: 'N1-N402:N101["ST"]',
  shipto_zip: 'N1-N403:N101["ST"]',
};

interchange.functionalGroups.forEach((group) => {
  group.transactions.forEach((transaction) => {
    console.log(transaction.toObject(map));
  });
});
