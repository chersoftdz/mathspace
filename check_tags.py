import re
import sys

def check_jsx_balance(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()

    # We manually find all opening and closing html tags
    # A simple regex for JSX tags matching only the names
    tags = re.findall(r'</?([a-zA-Z0-9]+)[^>]*>', text)
    
    stack = []
    
    # We will ignore self closing components or components that usually don't have children here for a robust method, but in JSX everything can have children.
    # Actually, we can just print the stack of all tags in HTML to see where the mismatch is.
    
    # Let's do a line by line parse
    lines = text.split('\n')
    
    for i, line in enumerate(lines):
        line_tags = re.finditer(r'</?([a-zA-Z0-9]+)[^>]*>', line)
        for m in line_tags:
            full_tag = m.group(0)
            tag_name = m.group(1)
            
            # self-closing tags in JSX e.g. <img /> or <input /> or <br /> or <Avatar />
            if full_tag.endswith('/>'):
                continue
            if tag_name.lower() in ['img', 'input', 'br', 'hr']:
                if not full_tag.endswith('/>'):
                    # standard HTML allows non self closing but we assume in React it's properly closed.
                    pass
                
            is_closing = full_tag.startswith('</')
            
            if not is_closing:
                # We skip empty fragments <>, they don't match the regex anyway.
                stack.append((tag_name, i + 1, full_tag))
            else:
                if not stack:
                    print(f"ERROR: Found closing </{tag_name}> at line {i+1} but stack is empty!")
                    return
                last_tag = stack.pop()
                if last_tag[0] != tag_name:
                    print(f"ERROR: Mismatched tag at line {i+1}. Expected </{last_tag[0]}> (opened at {last_tag[1]}), found </{tag_name}>.")
                    print(f"Full opening tag: {last_tag[2]}")
                    return

    if stack:
        print("Unclosed tags remaining in stack:")
        for t in stack:
            print(f"  <{t[0]}> opened at line {t[1]}")
    else:
        print("All tags matched perfectly!")

check_jsx_balance('c:/Users/LENOVO/Desktop/فضاء الرياضيات/index.html')
