#!/usr/bin/env python3
"""Fix unclosed header divs in page files."""

BASE = '/home/ubuntu/allenest-child-safety-ai/client/src/pages/'

# For each file, define exact old string -> new string replacements
FIXES = {
    'Meals.tsx': (
        '        <div className="page-header-gradient px-4 pt-10 pb-6">\n'
        '          <div className="max-w-md mx-auto">\n'
        '          <h1 className="text-2xl font-extrabold text-white">{t(\'mealJournal\')}</h1>\n'
        '          <p className="text-sm text-white/80 mt-1">\n'
        '            {language === \'fr\' ? "Sélectionnez les ingrédients du repas de votre enfant" : language === \'ar\' ? \'اختر مكونات وجبة طفلك\' : "Select ingredients from your child\'s meal"}\n'
        '          </p>\n'
        '        </div>',
        # ↓ new
        '        <div className="page-header-gradient px-4 pt-10 pb-6">\n'
        '          <div className="max-w-md mx-auto">\n'
        '            <h1 className="text-2xl font-extrabold text-white">{t(\'mealJournal\')}</h1>\n'
        '            <p className="text-sm text-white/80 mt-1">\n'
        '              {language === \'fr\' ? "Sélectionnez les ingrédients du repas de votre enfant" : language === \'ar\' ? \'اختر مكونات وجبة طفلك\' : "Select ingredients from your child\'s meal"}\n'
        '            </p>\n'
        '          </div>\n'
        '        </div>'
    ),
    'Symptoms.tsx': (
        '        <div className="page-header-pink px-4 pt-10 pb-6">\n'
        '          <div className="max-w-md mx-auto">\n'
        '          <h1 className="text-2xl font-extrabold text-white">{t(\'symptomTracker\')}</h1>\n'
        '          <p className="text-sm text-white/80 mt-1">\n'
        '            {language === \'fr\' ? "Enregistrez les symptômes de votre enfant" : language === \'ar\' ? \'سجل أعراض طفلك\' : "Record any symptoms your child is experiencing"}\n'
        '          </p>\n'
        '        </div>',
        # ↓ new
        '        <div className="page-header-pink px-4 pt-10 pb-6">\n'
        '          <div className="max-w-md mx-auto">\n'
        '            <h1 className="text-2xl font-extrabold text-white">{t(\'symptomTracker\')}</h1>\n'
        '            <p className="text-sm text-white/80 mt-1">\n'
        '              {language === \'fr\' ? "Enregistrez les symptômes de votre enfant" : language === \'ar\' ? \'سجل أعراض طفلك\' : "Record any symptoms your child is experiencing"}\n'
        '            </p>\n'
        '          </div>\n'
        '        </div>'
    ),
    'Timeline.tsx': (
        '        <div className="page-header-purple px-4 pt-10 pb-6">\n'
        '          <div className="max-w-md mx-auto">\n'
        '          <h1 className="text-2xl font-extrabold text-white">{t(\'timeline\')}</h1>\n'
        '        </div>',
        # ↓ new
        '        <div className="page-header-purple px-4 pt-10 pb-6">\n'
        '          <div className="max-w-md mx-auto">\n'
        '            <h1 className="text-2xl font-extrabold text-white">{t(\'timeline\')}</h1>\n'
        '          </div>\n'
        '        </div>'
    ),
}

for fname, (old, new) in FIXES.items():
    fpath = BASE + fname
    with open(fpath, 'r') as f:
        content = f.read()
    
    if old in content:
        content = content.replace(old, new, 1)
        with open(fpath, 'w') as f:
            f.write(content)
        print(f'✅ Fixed {fname}')
    else:
        print(f'❌ Pattern not found in {fname}')
        # Show what's actually there
        import re
        m = re.search(r'page-header-[a-z]+ px-4 pt-10 pb-6.*?</div>', content, re.DOTALL)
        if m:
            print(f'   Found: {repr(m.group()[:200])}')

print('\nDone!')
