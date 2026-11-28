import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
const html=await readFile(new URL("../invitacion.html",import.meta.url),"utf8");
test("invitation has mobile viewport, entry and privacy links",()=>{assert.match(html,/name="viewport"/);assert.match(html,/href="\/">Entrar en Gyste/);assert.match(html,/href="\/privacidad.html"/);assert.match(html,/mayores de 18 años/);});
test("invitation stays lightweight without scripts or external assets",()=>{assert.ok(Buffer.byteLength(html)<10000);assert.doesNotMatch(html,/<script\b|<iframe\b|https?:\/\//i);});
