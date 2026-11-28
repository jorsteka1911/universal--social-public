import {test} from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
const html=await readFile(new URL("../negocios.html",import.meta.url),"utf8");
test("commercial pilot remains transparent",()=>{assert.match(html,/todavía sin cobros/i);assert.match(html,/no se garantizan ventas/i);assert.match(html,/piloto es gratuito/i);});
test("privacy and terms links exist",async()=>{for(const page of ["privacidad.html","condiciones.html"]){assert.ok(html.includes('href="/'+page+'"'));assert.ok((await readFile(new URL("../"+page,import.meta.url),"utf8")).length>0);}});

test("home businesses can avoid publishing home addresses",()=>assert.match(html,/sin publicar tu domicilio particular/i));
