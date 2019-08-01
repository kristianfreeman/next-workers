addEventListener("fetch", event => handleRequest(event.request));

const index = require("../.next/serverless/pages/index");

class FauxResponse {
  constructor() {
    this._stream = new TransformStream();
    return this;
  }

  write(chunk) {
    console.log("called write!");
    chunk.pipeTo(this._stream.writable);
  }
}

const compat = async (page, req) => {
  console.log(page);
  console.log(req);
  const transformStream = new FauxResponse();
  console.log(transformStream);
  page.render(req, transformStream._stream.readable);
  console.log(transformStream._stream.readable);
  return new Response(transformStream._stream.readable);
};

const handleRequest = async request => {
  const url = new URL(request.url);
  return compat(index, request);
};
