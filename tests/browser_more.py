from pathlib import Path
import json
import re
from playwright.sync_api import expect

CATALOG=json.loads((Path(__file__).resolve().parents[1]/'practice/lab/catalog.json').read_text(encoding='utf-8'))

def run_labs(page,base):
    assert len(CATALOG)==47 and len({item['slug'] for item in CATALOG})==47
    page.context.grant_permissions(['clipboard-read','clipboard-write'])
    for item in CATALOG:
        page.set_viewport_size({'width':1100,'height':850})
        page.goto(base+'/lab/#'+item['slug'])
        expect(page.locator('#title')).to_have_text(str(item['id'])+'. '+item['title'])
        for action in item['actions']:
            kind=action['type'];target=page.locator('#lab '+action['selector']) if 'selector' in action else None
            if kind=='click':target.click()
            elif kind=='fill':target.fill(action['value'])
            elif kind=='select':target.select_option(action['value'])
            elif kind=='range':target.evaluate('(element,value)=>{element.value=value;element.dispatchEvent(new Event("input",{bubbles:true}));}',action['value'])
            elif kind in ('text','expectText'):expect(target).to_have_text(action['value'])
            elif kind=='notText':expect(target).not_to_have_text(action['value'])
            elif kind=='visible':expect(target).to_be_visible()
            elif kind=='hidden':expect(target).to_be_hidden()
            elif kind=='disabled':expect(target).to_be_disabled()
            elif kind=='focus':target.focus()
            elif kind=='press':target.press(action['value'])
            elif kind=='value':expect(target).to_have_value(action['value'])
            elif kind=='count':expect(target).to_have_count(action['value'])
            elif kind=='wait':page.wait_for_timeout(action['value'])
            elif kind=='reload':page.reload()
            elif kind=='positive':assert float(target.inner_text())>0,item['slug']
            elif kind=='style':expect(target).to_have_css(re.sub(r'[A-Z]',lambda m:'-'+m[0].lower(),action['property']),action['value'])
            elif kind=='gridColumns':assert len(target.evaluate('element=>getComputedStyle(element).gridTemplateColumns').split())==action['value']
            elif kind=='scroll':target.evaluate('(element,value)=>{element.scrollTop=value}',action['value'])
            elif kind=='sticky':assert abs(target.bounding_box()['y']-page.locator('#lab '+action['parent']).bounding_box()['y'])<=3
            elif kind=='drag':page.locator('#lab '+action.get('source',action['selector'])).drag_to(page.locator('#lab '+action['target']))
            elif kind=='attribute':expect(target).to_have_attribute(action['name'],action['value'])
            elif kind=='draw':
                box=target.bounding_box();page.mouse.move(box['x']+20,box['y']+20);page.mouse.down();page.mouse.move(box['x']+100,box['y']+80,steps=8);page.mouse.up()
            elif kind=='canvasInk':assert target.evaluate('canvas=>Array.from(canvas.getContext("2d").getImageData(0,0,canvas.width,canvas.height).data).some((v,i)=>i%4===3&&v>0)')
            elif kind=='file':target.set_input_files({'name':'note.txt','mimeType':'text/plain','buffer':action['content'].encode('utf-8')})
            elif kind=='clipboard':assert page.evaluate('navigator.clipboard.readText()')==action['value']
            else:raise AssertionError('Unknown action '+kind)
        page.set_viewport_size({'width':390,'height':844})
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),('mobile overflow',item['slug'])
        print('lab',item['id'],item['slug'],'PASS')
    print('Browser labs passed')
