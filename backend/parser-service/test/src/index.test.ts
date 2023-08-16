import { APIGatewayEvent } from "aws-lambda";
import { handler } from "../../src";

describe("ParseReportHandler", () => {
  it("should return response with body in JSON format", async () => {
    const eventDummy = {
      body: `
            ----------------------------120343901028425907851304
        Content-Disposition: form-data; name="report"; filename="original_01_2023.csv"
        Content-Type: text/csv
        
        Data operacji,Data waluty,Typ transakcji,Kwota,Waluta,Saldo po transakcji,Opis transakcji,,,,
        1/31/2023,1/29/2023,P�atno��,-20.83,PLN,106976.06,Tytu�:  749888530294962706715,Lokalizacja: Kraj: POLSKA Miasto: WARSZAWA Adres: JMP S.A. BIEDRONKA 4884,Data i czas operacji: 2023-01-29,"Oryginalna kwota operacji: 20,83 PLN",Numer karty: 425125******0521
        
        ----------------------------120343901028425907851304
        Content-Disposition: form-data; name="bank"
        
        pko
        ----------------------------120343901028425907851304--
            `,
      headers: {
        "Content-Type":
          "multipart/form-data; boundary=----------------------------120343901028425907851304",
      },
      multiValueHeaders: {},
      isBase64Encoded: false,
      path: "/report",
      pathParameters: null,
      queryStringParameters: null,
      multiValueQueryStringParameters: null,
      stageVariables: null,
      requestContext: null as any,
      resource: null as any,
      httpMethod: "post",
    } as APIGatewayEvent;

    const result = await handler(eventDummy);

    expect(typeof JSON.parse(result.body)).toBe("object");
  });
});
