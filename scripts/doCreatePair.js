const { deployMaxlihToken } = require("./deployMaxlihToken.js");
const { createPair } = require("./createPair.js");

await createPair(await deployMaxlihToken(100_000));