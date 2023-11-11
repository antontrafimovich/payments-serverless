export type RequestOptions = {
  headers?: HeadersInit;
  method?: string;
  body?: Record<string, string>;
};

const send = (url: string, options: RequestOptions) => {
  return fetch(url, { ...options, body: JSON.stringify(options.body) });
};

export const request = async (url: string, options: RequestOptions) => {
  const credsString = localStorage.getItem("token");

  if (!credsString) {
    document.location.href = `${document.location.origin}/auth`;
    return;
  }

  const creds = JSON.parse(credsString);

  if (new Date().getTime() > creds.expiary_date) {
    let newCredsResponse;
    try {
      newCredsResponse = await send(
        "https://7nbmfhr8y9.execute-api.eu-central-1.amazonaws.com/prod/auth/refresh",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${encodeURIComponent(btoa(credsString))}`,
          },
        }
      );
    } catch (err) {
      document.location.href = `${document.location.protocol}://${document.location.origin}/auth`;
      return;
    }

    let newCredsBase64;

    try {
      newCredsBase64 = await newCredsResponse.text();

      const newCredsString = atob(newCredsBase64);
      JSON.parse(newCredsString);

      localStorage.setItem("token", newCredsString);
    } catch (err) {
      throw new Error("Problem with new token");
    }

    return send(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${newCredsBase64}`,
      },
    });
  }

  return send(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${btoa(credsString)}`,
    },
  });
};
