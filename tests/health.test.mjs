import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
const source=await readFile(new URL("../api/health.js",import.meta.url),"utf8");
const {default:handler}=await import("data:text/javascript;base64,"+Buffer.from(source).toString("base64"));
function request(method){const result={headers:{}};const res={setHeader(k,v){result.headers[k]=v},status(n){result.status=n;return this},json(body){result.body=body;return this}};handler({method},res);return result;}
test("GET reports server only, no database claim or private data",()=>{const r=request("GET");assert.equal(r.status,200);assert.deepEqual(r.body,{applicationServer:"reachable",database:"not_checked"});assert.equal(r.headers["Cache-Control"],"no-store");assert.equal(r.headers["X-Content-Type-Options"],"nosniff");});
test("other methods rejected",()=>{for(const m of ["POST","PUT","DELETE"]){const r=request(m);assert.equal(r.status,405);assert.equal(r.headers.Allow,"GET");}});
