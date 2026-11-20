"""Run with Playwright installed; optional BROWSER_EXECUTABLE points to local Edge/Chrome."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import os
from threading import Thread
from playwright.sync_api import sync_playwright, expect

root = Path(__file__).resolve().parents[1]


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_): pass


server = ThreadingHTTPServer(('127.0.0.1', 0), partial(QuietHandler, directory=str(root)))
thread = Thread(target=server.serve_forever, daemon=True)
thread.start()
base = f'http://127.0.0.1:{server.server_port}/practice'
try:
    with sync_playwright() as playwright:
        options = {'headless': True}
        if os.environ.get('BROWSER_EXECUTABLE'): options['executable_path'] = os.environ['BROWSER_EXECUTABLE']
        browser = playwright.chromium.launch(**options)
        try:
            page = browser.new_page(viewport={'width':1100,'height':850})
            errors = []
            page.on('pageerror', lambda error: errors.append(str(error)))
            page.on('response', lambda response: errors.append(f'{response.status} {response.url}') if response.status >= 400 else None)
            page.goto(base + '/todo/')
            malicious_text = '<img src=x onerror=alert(1)>'
            page.locator('#task').fill(malicious_text)
            page.locator('#form button').click()
            expect(page.locator('#list li')).to_have_count(1)
            expect(page.locator('#list img')).to_have_count(0)
            page.reload()
            expect(page.locator('#list li span')).to_have_text(malicious_text)
            page.locator('#list input').check()
            page.locator('#filter').select_option('open')
            expect(page.locator('#list li')).to_have_count(0)
            page.locator('#filter').select_option('all')
            expect(page.locator('#list li')).to_have_count(1)

            page.goto(base + '/expenses/')
            for amount in ('0.10','0.20'):
                page.locator('#amount').fill(amount); page.locator('#form button').click()
            expect(page.locator('#total')).to_have_text('0.30')
            page.locator('#amount').fill('1.001'); page.locator('#form button').click()
            expect(page.locator('#message')).not_to_be_empty()
            expect(page.locator('#list li')).to_have_count(2)
            with page.expect_download() as download:
                page.locator('#export').click()
            assert download.value.suggested_filename == 'expenses.csv'
            page.locator('#list button').first.click()
            expect(page.locator('#total')).to_have_text('0.20')

            page.goto(base + '/sorting/')
            page.locator('#numbers').fill('3, -2, 1, 3')
            page.locator('#form button').click()
            heights = page.locator('.bar').evaluate_all('(bars)=>bars.map(b=>b.getBoundingClientRect().height)')
            assert max(heights) >= 140 and min(heights) < max(heights), heights
            for _ in range(100):
                if page.locator('#next').is_disabled(): break
                page.locator('#next').click()
            expect(page.locator('#values')).to_have_text('-2, 1, 3, 3')
            heights = page.locator('.bar').evaluate_all('(bars) => bars.map(b => b.getBoundingClientRect().height)')
            assert max(heights) > min(heights), 'bars must show relative magnitudes'
            page.locator('#previous').click()
            expect(page.locator('#next')).to_be_enabled()

            screenshots = os.environ.get('SCREENSHOT_DIR')
            if screenshots: Path(screenshots).mkdir(parents=True, exist_ok=True)
            for name in ('todo','expenses','sorting'):
                page.set_viewport_size({'width':390,'height':844})
                page.goto(base + '/' + name + '/')
                assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), name + ' overflows mobile viewport'
                if screenshots: page.screenshot(path=str(Path(screenshots) / (name + '.png')), full_page=True)
            assert not errors, errors
            import sys
            sys.path.insert(0,str(Path(__file__).resolve().parent))
            from browser_more import run_labs
            run_labs(page,base)
            assert not errors, errors
            print('Browser: persistence, filtering, XSS text, money, CSV, sorting and 390px layout passed')
        finally: browser.close()
finally:
    server.shutdown(); server.server_close(); thread.join()
