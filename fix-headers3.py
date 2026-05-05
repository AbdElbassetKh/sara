#!/usr/bin/env python3
"""Fix unclosed header divs in Doctor.tsx and Growth.tsx."""

BASE = '/home/ubuntu/allenest-child-safety-ai/client/src/pages/'

FIXES = {
    'Doctor.tsx': (
        '        <div className="page-header-gradient px-4 pt-10 pb-6">\n'
        '          <div className="max-w-md mx-auto">\n'
        '          <h1 className="text-2xl font-extrabold text-white">{t(\'doctorVisits\')}</h1>\n'
        '          <p className="text-sm text-white/80 mt-1">\n'
        '            {language === \'fr\' ? "Suivez les rendez-vous médicaux et les dossiers" : language === \'ar\' ? \'تتبع المواعيد الطبية والسجلات\' : "Track medical appointments and records"}\n'
        '          </p>\n'
        '        </div>',
        # ↓ new
        '        <div className="page-header-gradient px-4 pt-10 pb-6">\n'
        '          <div className="max-w-md mx-auto">\n'
        '            <h1 className="text-2xl font-extrabold text-white">{t(\'doctorVisits\')}</h1>\n'
        '            <p className="text-sm text-white/80 mt-1">\n'
        '              {language === \'fr\' ? "Suivez les rendez-vous médicaux et les dossiers" : language === \'ar\' ? \'تتبع المواعيد الطبية والسجلات\' : "Track medical appointments and records"}\n'
        '            </p>\n'
        '          </div>\n'
        '        </div>'
    ),
    'Growth.tsx': (
        '        <div className="page-header-green px-4 pt-10 pb-6">\n'
        '          <div className="max-w-md mx-auto">\n'
        '          <h1 className="text-2xl font-extrabold text-white">{t(\'growthTracker\')}</h1>\n'
        '          <p className="text-sm text-white/80 mt-1">\n'
        '            {language === \'fr\' ? "Suivez le développement de votre enfant" : language === \'ar\' ? \'تابع نمو طفلك\' : "Monitor your child\'s development"}\n'
        '          </p>\n'
        '        </div>',
        # ↓ new
        '        <div className="page-header-green px-4 pt-10 pb-6">\n'
        '          <div className="max-w-md mx-auto">\n'
        '            <h1 className="text-2xl font-extrabold text-white">{t(\'growthTracker\')}</h1>\n'
        '            <p className="text-sm text-white/80 mt-1">\n'
        '              {language === \'fr\' ? "Suivez le développement de votre enfant" : language === \'ar\' ? \'تابع نمو طفلك\' : "Monitor your child\'s development"}\n'
        '            </p>\n'
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
        # Debug: show what's there
        import re
        m = re.search(r'page-header-[a-z]+ px-4 pt-10 pb-6.*?</div>', content, re.DOTALL)
        if m:
            print(f'   Found block: {repr(m.group()[:300])}')

print('\nDone!')
