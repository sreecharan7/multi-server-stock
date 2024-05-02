import axios from "axios"

export default async function (path,data1,urlM) {
    let url = `${process.env.SENDER}`+path;
    if(urlM){url=urlM;}
    let data = JSON.stringify(data1);
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: url,
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    return await axios.request(config)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return false;
    });
}