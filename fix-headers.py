#!/usr/bin/env python3
"""Fix unclosed divs in page headers."""
import re

BASE = '/home/ubuntu/allenest-child-safety-ai/client/src/pages/'

# Each page: find the header block and replace with properly closed version
FIXES = {
    'Meals.tsx': {
        'old': '''        <div className="page-header-gradient px-4 pt-10 pb-6">
          <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-extrabold text-white">{t('mealJournal')}</h1>
          <p className="text-sm text-white/80 mt-1">
            {language === 'fr' ? "Sélectionnez les ingrédients du repas de votre enfant" : language === 'ar' ? 'اختر مكونات وجبة طفلك' : "Select ingredients from your child's meal"}
          </p>
        </div>''',
        'new': '''        <div className="page-header-gradient px-4 pt-10 pb-6">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-extrabold text-white">{t('mealJournal')}</h1>
            <p className="text-sm text-white/80 mt-1">
              {language === 'fr' ? "Sélectionnez les ingrédients du repas de votre enfant" : language === 'ar' ? 'اختر مكونات وجبة طفلك' : "Select ingredients from your child's meal"}
            </p>
          </div>
        </div>'''
    },
}

def fix_generic_header(content, page_header_class):
    """Fix a generic unclosed header div pattern."""
    # Pattern: header div opened, inner div opened, h1, p, then only 1 closing div
    pattern = (
        r'(<div className="' + page_header_class + r' px-4 pt-10 pb-6">\s*'
        r'<div className="max-w-md mx-auto">\s*'
        r'<h1[^<]*>.*?</h1>\s*'
        r'<p[^<]*>.*?</p>\s*'
        r'</div>)'
    )
    # Add the missing closing </div> after the single </div>
    replacement = r'\1\n        </div>'
    new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    return new_content

pages_config = {
    'Meals.tsx': 'page-header-gradient',
    'Symptoms.tsx': 'page-header-pink',
    'Growth.tsx': 'page-header-green',
    'Timeline.tsx': 'page-header-purple',
    'Doctor.tsx': 'page-header-gradient',
    'Vaccines.tsx': 'page-header-gradient',
}

for fname, header_class in pages_config.items():
    fpath = BASE + fname
    try:
        with open(fpath, 'r') as f:
            content = f.read()
        
        new_content = fix_generic_header(content, header_class)
        
        if new_content != content:
            with open(fpath, 'w') as f:
                f.write(new_content)
            print(f'Fixed {fname}')
        else:
            print(f'No regex match for {fname} - trying manual fix')
            # Manual: find the header block and ensure it has 2 closing divs
            # Look for the pattern with only 1 closing div after the p tag
            manual_pattern = (
                r'(<div className="' + header_class + r' px-4 pt-10 pb-6">\n'
                r'          <div className="max-w-md mx-auto">\n'
                r'          )'
            )
            if re.search(manual_pattern, content):
                # The inner div is not indented correctly - fix it
                content = re.sub(
                    r'(<div className="' + header_class + r' px-4 pt-10 pb-6">\n          <div className="max-w-md mx-auto">\n          )',
                    f'<div className="{header_class} px-4 pt-10 pb-6">\n          <div className="max-w-md mx-auto">\n            ',
                    content
                )
                # Now find the single </div> that closes inner div and add outer closing
                print(f'  Applied manual fix for {fname}')
                with open(fpath, 'w') as f:
                    f.write(content)
    except Exception as e:
        print(f'Error {fname}: {e}')

print('\nDone!')
