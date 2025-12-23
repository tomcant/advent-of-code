#!/bin/bash
# Install pre-commit hook to auto-update README.md

cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh
python3 .scripts/update-readme.py
git add README.md
EOF

chmod +x .git/hooks/pre-commit
