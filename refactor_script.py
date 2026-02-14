
import os

file_path = r'd:\Porfolio\index.html'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Operations in reverse order to preserve indices

# 1. Replace Script Block (1027-2222 -> index 1026-2222)
# Check if lines match expectation
if '<script>' not in lines[1026]:
    print(f"Warning: Line 1027 does not contain <script>. content: {lines[1026]}")
if '</script>' not in lines[2221]:
    print(f"Warning: Line 2222 does not contain </script>. content: {lines[2221]}")
    # Try 2222?
    if '</script>' in lines[2222]: 
         print("Found it at 2223")

# We will delete from 1026 to 2222 (inclusive of start, inclusive of end tag)
# Slice: [1026:2222] -- waits, python slice end is exclusive. So [1026:2222] excludes 2222 (line 2223).
# Line 2222 is index 2221.
# So slice should be [1026:2222].
lines[1026:2222] = ['    <script src="js/main.js"></script>\n']

# 2. Replace Style Block (48-376 -> index 47-376)
# Check expectation
if '<style>' not in lines[47]:
    print(f"Warning: Line 48 does not contain <style>. content: {lines[47]}")
if '</style>' not in lines[375]: # Line 376 is index 375
    print(f"Warning: Line 376 does not contain </style>. content: {lines[375]}")

# Slice [47:376] (excludes index 376, so includes up to 375)
lines[47:376] = ['    <link rel="stylesheet" href="css/styles.css">\n']

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Successfully refactored index.html")
