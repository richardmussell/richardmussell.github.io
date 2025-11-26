# SHA Pinning Guide - Supply Chain Security

## 🔒 Why SHA Pinning?

Version tags like `@v4` or `@latest` are **mutable** and can be updated by action maintainers. This creates a supply chain security risk:

- **Tag Hijacking**: If a maintainer account is compromised, tags can be updated to malicious versions
- **Silent Updates**: Action tags can change without notice
- **Supply Chain Attack**: Attackers could inject malicious code

**SHA pinning** uses immutable commit hashes that cannot be changed, ensuring supply chain integrity.

---

## 📋 How to Get SHA Hashes

### Method 1: GitHub UI

1. Navigate to the action's repository (e.g., `actions/checkout`)
2. Click on **Releases** or navigate to the specific tag
3. Click on the commit hash (short SHA) to view commit details
4. Copy the **full commit SHA** (40 characters)

**Example:**
- Repository: `https://github.com/actions/checkout`
- Tag: `v4`
- Commit: `f43a0e5ff2bd294d163a5b5d2e9b3c4e8b5f6a7`

### Method 2: GitHub API

```bash
# Get SHA for actions/checkout@v4
curl -s https://api.github.com/repos/actions/checkout/git/refs/tags/v4 | jq -r '.object.sha'
```

### Method 3: Direct Commit URL

Visit: `https://github.com/OWNER/REPO/commits/TAG`

---

## 🔧 Converting Actions to SHA

### Current Actions Requiring Conversion

| Action | Current Tag | Status |
|--------|-------------|--------|
| `actions/checkout` | `@v4` | ⚠️ Needs SHA |
| `actions/configure-pages` | `@v5` | ⚠️ Needs SHA |
| `actions/setup-node` | `@v4` | ⚠️ Needs SHA |
| `actions/upload-pages-artifact` | `@v3` | ⚠️ Needs SHA |
| `actions/deploy-pages` | `@v4` | ⚠️ Needs SHA |
| `actions/upload-artifact` | `@v4` | ⚠️ Needs SHA |
| `peaceiris/actions-hugo` | `@v2` | ⚠️ Needs SHA |
| `gitleaks/gitleaks-action` | `@v2` | ⚠️ Needs SHA |
| `github/super-linter` | `@v5` | ⚠️ Needs SHA |

### Conversion Example

**Before (Insecure):**
```yaml
- name: Checkout repository
  uses: actions/checkout@v4
```

**After (Secure):**
```yaml
- name: Checkout repository
  uses: actions/checkout@f43a0e5ff2bd294d163a5b5d2e9b3c4e8b5f6a7
```

---

## ✅ Verification

After converting to SHAs, verify:

1. **Workflow Syntax**: All workflows validate
2. **Builds Pass**: GitHub Actions runs successfully
3. **No Warnings**: No "action not found" errors

---

## 🔄 Updating Pinned Actions

When you need to update an action:

1. Find the new tag/release
2. Get the new commit SHA
3. Update the workflow file
4. Test thoroughly
5. Commit with message: `security: update actions/checkout SHA`

---

**Note**: SHA pinning is a best practice for production workflows. The initial conversion requires manual SHA lookup, but provides maximum supply chain security.

