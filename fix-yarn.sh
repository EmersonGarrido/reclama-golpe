#!/bin/bash

# ================================================================
# Fix Yarn Installation Script
# ================================================================
# This script fixes Yarn installation issues on the server
# ================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}[INFO]${NC} Fixing Yarn installation..."

# Get npm prefix
NPM_PREFIX=$(npm config get prefix)
echo -e "${BLUE}[INFO]${NC} NPM prefix: ${NPM_PREFIX}"

# Uninstall any existing yarn
echo -e "${BLUE}[INFO]${NC} Removing existing Yarn installations..."
npm uninstall -g yarn 2>/dev/null || true
rm -f /usr/local/bin/yarn 2>/dev/null || true
rm -f /usr/bin/yarn 2>/dev/null || true

# Install Yarn via npm
echo -e "${BLUE}[INFO]${NC} Installing Yarn via npm..."
npm install -g yarn@1.22.22 --force

# Update PATH
export PATH="$PATH:${NPM_PREFIX}/bin"

# Create symlinks
echo -e "${BLUE}[INFO]${NC} Creating symlinks..."
if [ -f "${NPM_PREFIX}/lib/node_modules/yarn/bin/yarn.js" ]; then
    ln -sf "${NPM_PREFIX}/lib/node_modules/yarn/bin/yarn.js" /usr/local/bin/yarn
    chmod +x /usr/local/bin/yarn
    echo -e "${GREEN}[SUCCESS]${NC} Created yarn symlink from lib"
elif [ -f "${NPM_PREFIX}/bin/yarn" ]; then
    ln -sf "${NPM_PREFIX}/bin/yarn" /usr/local/bin/yarn
    chmod +x /usr/local/bin/yarn
    echo -e "${GREEN}[SUCCESS]${NC} Created yarn symlink from bin"
fi

# Alternative method using curl
if ! command -v yarn &> /dev/null; then
    echo -e "${YELLOW}[WARNING]${NC} Yarn still not found, trying official installer..."
    curl -o- -L https://yarnpkg.com/install.sh | bash
    export PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"
fi

# Update bashrc
echo -e "${BLUE}[INFO]${NC} Updating PATH in .bashrc..."
grep -q "${NPM_PREFIX}/bin" /root/.bashrc || echo "export PATH=\"\$PATH:${NPM_PREFIX}/bin\"" >> /root/.bashrc
grep -q ".yarn/bin" /root/.bashrc || echo 'export PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"' >> /root/.bashrc

# Source bashrc
source /root/.bashrc

# Verify installation
echo -e "${BLUE}[INFO]${NC} Verifying installation..."
if command -v yarn &> /dev/null; then
    YARN_VERSION=$(yarn --version)
    echo -e "${GREEN}[SUCCESS]${NC} Yarn ${YARN_VERSION} installed successfully!"
    echo -e "${GREEN}[SUCCESS]${NC} Location: $(which yarn)"
else
    echo -e "${RED}[ERROR]${NC} Yarn installation failed"
    echo -e "${YELLOW}[INFO]${NC} You can use npm instead:"
    echo "  npm install"
    echo "  npm run build"
    exit 1
fi

# Test Yarn
echo -e "${BLUE}[INFO]${NC} Testing Yarn..."
yarn --version

echo -e "${GREEN}[SUCCESS]${NC} Yarn fix completed!"
echo ""
echo -e "${BLUE}[INFO]${NC} Next steps:"
echo "  1. Run: source /root/.bashrc"
echo "  2. Continue with deployment: ./deploy.sh"
echo ""
echo -e "${YELLOW}[TIP]${NC} If yarn still doesn't work, use npm:"
echo "  npm install && npm run build"