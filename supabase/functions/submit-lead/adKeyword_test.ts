// deno test supabase/functions/submit-lead/adKeyword_test.ts
import { assertEquals } from 'jsr:@std/assert@1'
import { adKeyword } from './adKeyword.ts'

Deno.test('a plain keyword is kept, tidied to lower case and single spaces', () => {
  assertEquals(adKeyword('custom surfboards'), 'custom surfboards')
  assertEquals(adKeyword('  Surfboard   Ding Repair '), 'surfboard ding repair')
  assertEquals(adKeyword('"custom surfboards"'), 'custom surfboards')
  assertEquals(adKeyword('[surfboard repair]'), 'surfboard repair')
  assertEquals(adKeyword("rip & tear's 4+1 board-shop"), "rip & tear's 4+1 board-shop")
  assertEquals(adKeyword('a'.repeat(80)), 'a'.repeat(80))
  assertEquals(adKeyword('ding\nrepair'), 'ding repair')
})

Deno.test('anything else is dropped as nothing, so the lead still goes', () => {
  for (const bad of [undefined, null, 42, {}, '', '   ', '-x', 'a'.repeat(81), 'a'.repeat(101), '<script>', 'caf' + String.fromCharCode(233)]) {
    assertEquals(adKeyword(bad), null, String(bad))
  }
})

Deno.test('input longer than the browser sends is dropped before any pattern runs, even if it would tidy to a keyword', () => {
  assertEquals(adKeyword('"'.repeat(98) + 'abc'), null)
  assertEquals(adKeyword('"'.repeat(96) + 'abc'), 'abc')
})
