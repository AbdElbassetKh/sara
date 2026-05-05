#!/usr/bin/env python3
"""Update page headers with vivid gradient classes."""
import re
import os

BASE = '/home/ubuntu/allenest-child-safety-ai/client/src/pages'

PAGES = {
    'Meals.tsx': {
        'header_class': 'page-header-gradient',
        'title_color': 'text-white',
        'sub_color': 'text-white/80',
        'old_wrapper': '<div className="pt-2">',
        'new_wrapper': '<div className="page-header-gradient px-4 pt-10 pb-6"><div className="max-w-md mx-auto">',
        'close_extra': '</div>',
    },
    'Symptoms.tsx': {
        'header_class': 'page-header-pink',
        'title_color': 'text-white',
        'sub_color': 'text-white/80',
    },
    'Growth.tsx': {
        'header_class': 'page-header-green',
        'title_color': 'text-white',
        'sub_color': 'text-white/80',
    },
    'Vaccines.tsx': {
        'header_class': 'page-header-gradient',
        'title_color': 'text-white',
        'sub_color': 'text-white/80',
    },
    'Timeline.tsx': {
        'header_class': 'page-header-purple',
        'title_color': 'text-white',
        'sub_color': 'text-white/80',
    },
    'Insights.tsx': {
        'header_class': 'page-header-pink',
        'title_color': 'text-white',
        'sub_color': 'text-white/80',
    },
    'Doctor.tsx': {
        'header_class': 'page-header-gradient',
        'title_color': 'text-white',
        'sub_color': 'text-white/80',
    },
    'Notifications.tsx': {
        'header_class': 'page-header-orange',
        'title_color': 'text-white',
        'sub_color': 'text-white/80',
    },
}

for fname, cfg in PAGES.items():
    fpath = os.path.join(BASE, fname)
    if not os.path.exists(fpath):
        print(f'SKIP {fname} - not found')
        continue
    
    with open(fpath, 'r') as f:
        content = f.read()
    
    # Pattern 1: Replace <div className="pt-2"> header wrapper
    old = '<div className="pt-2">'
    new = f'<div className="{cfg["header_class"]} px-4 pt-10 pb-6"><div className="max-w-md mx-auto">'
    if old in content:
        content = content.replace(old, new, 1)
        # Find the h1 and p after this and update colors
        content = re.sub(
            r'<h1 className="text-2xl font-bold text-foreground">',
            f'<h1 className="text-2xl font-extrabold {cfg["title_color"]}">',
            content, count=1
        )
        content = re.sub(
            r'<p className="text-sm text-muted-foreground mt-1">',
            f'<p className="text-sm {cfg["sub_color"]} mt-1">',
            content, count=1
        )
        # Close the extra div after the header section (after </p>)
        # We need to find the closing </div> of the old pt-2 div and add an extra </div>
        print(f'Updated {fname} - replaced pt-2 header')
    else:
        print(f'SKIP {fname} - pattern not found')
    
    with open(fpath, 'w') as f:
        f.write(content)

print('Done!')
