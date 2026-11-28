import {test} from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
const source=await readFile(new URL("../api/creative-status.js",import.meta.url),"utf8");
const {default:handler}=await import("data:text/javascript;base64,"+Buffer.from(source).toString("base64"));
function request(method){const r={headers:{},setHeader(k,v){this.headers[k]=v;},status(n){this.code=n;return this;},json(v){this.body=v;return this;}};handler({method},r);return r;}
test("unavailable engines and billing disabled",()=>{const r=request("GET");assert.equal(r.code,200);assert.equal(r.body.billingEnabled,false);for(const k of ["sceneGeneration","imageAnimation","automaticNarration"])assert.equal(r.body[k].available,false);assert.equal(r.headers["Cache-Control"],"no-store");});
test("reject writes",()=>{const r=request("POST");assert.equal(r.code,405);assert.equal(r.headers.Allow,"GET");});

test("all unavailable engines explain why",()=>{const r=request("GET");for(const k of ["sceneGeneration","imageAnimation","automaticNarration"])assert.equal(r.body[k].reason,"provider_not_connected");assert.equal(r.headers["X-Content-Type-Options"],"nosniff");});
test("reject other modifying methods",()=>{for(const method of ["PUT","PATCH","DELETE"])assert.equal(request(method).code,405);});

test("security headers apply to success and errors",()=>{for(const method of ["GET","POST"]){const r=request(method);assert.equal(r.headers["X-Frame-Options"],"DENY");assert.equal(r.headers["Referrer-Policy"],"no-referrer");assert.match(r.headers["Content-Security-Policy"],/frame-ancestors 'none'/);}});

test("creative status restricts cross-origin embedding",()=>{for(const method of ["GET","POST"])assert.equal(request(method).headers["Cross-Origin-Resource-Policy"],"same-origin");});
