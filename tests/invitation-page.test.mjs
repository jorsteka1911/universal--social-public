import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
const html=await readFile(new URL("../invitacion.html",import.meta.url),"utf8");
test("invitation has mobile viewport, entry and privacy links",()=>{assert.match(html,/name="viewport"/);assert.match(html,/href="\/">Entrar en Gyste/);assert.match(html,/href="\/privacidad.html"/);assert.match(html,/mayores de 18 años/);});
test("lightweight page has no external loaded assets",()=>{assert.ok(Buffer.byteLength(html)<10000);assert.doesNotMatch(html,/<script\b|<iframe\b|<link\b|\bsrc\s*=|@import|url\s*\(/i);});
test("WhatsApp sharing is opt-in and contains only the public invitation",()=>{const match=html.match(/href="(https:\/\/wa\.me\/\?text=[^"]+)"/);assert.ok(match);const u=new URL(match[1]);assert.equal(u.origin,"https://wa.me");assert.deepEqual([...u.searchParams.keys()],["text"]);assert.equal(u.searchParams.get("text"),"Te invito a conocer Gyste, una red social en beta para mayores de 18 años. https://gyste2025.vercel.app/invitacion.html");});
