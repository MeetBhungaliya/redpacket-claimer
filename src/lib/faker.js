import { faker } from "@faker-js/faker";

const generateAccount = () => {
  const label = faker.person.firstName();
  const fingerprint = faker.helpers.arrayElement([
    "48b3ba669c1108c0b7ba4afb2dbeac83",
    "d3ad819ce674a53f38a3587ef954efa2",
    "8884b3c2936c3f64e4a2e9adebb46644",
    "6dbb60914a851a1d6c486bf156203793",
    "fc78944335b7869df1dc5879b92ac69c",
  ]);

  const data = {
    url: faker.internet.url(),
    headers: {
      "bnc-uuid": faker.string.uuid(),
      csrftoken: faker.string.uuid(),
      "device-info": faker.string.alphanumeric(16),
      "fvideo-id": faker.string.uuid(),
      "fvideo-token": faker.string.uuid(),
      cookie: faker.word.words(32),
      clienttype: faker.internet.userAgent(),
    },
  };

  return {
    label,
    data,
    fingerprint,
  };
};

export { generateAccount };
