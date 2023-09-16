import { merge } from "../../src/merge";

describe("merge", () => {
  expect.hasAssertions();

  it("should correctly merge payments and shop metadata with alias", () => {
    const PAYMENTS_INFO = [
      {
        address:
          "Lokalizacja: Kraj: POLSKA Miasto: Kobylka Adres: KSK Krystian Sienko",
        date: "1/9/2023",
        value: "-75",
      },
    ];
    const SHOPS_INFO = [
      {
        address: "KSK Krystian Sienko /// ZABKA",
        type: "Groceries",
      },
    ];
    const MERGE_RESULT = [[0, "-75", "1/9/2023", "Groceries", "ZABKA"]];

    const result = merge(PAYMENTS_INFO, SHOPS_INFO);

    expect(result).toEqual(MERGE_RESULT);
  });
});
