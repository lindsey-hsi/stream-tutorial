export const post = (url, body, maybeAuth) => {
  let headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    // 'Access-Control-Allow-Origin': 'https://celadon-llama-ce8ee1.netlify.app',
    // 'Access-Control-Allow-Methods': 'POST,GET',
    // 'Access-Control-Allow-Headers': 'Content-Type',
    // 'Access-Control-Max-Age': '86400',
  };

  if (maybeAuth) {
    headers['Authorization'] = 'Bearer ' + maybeAuth;
  }


    return fetch(url, {
      mode: 'no-cors',
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    }).then(res => res.json())

};
