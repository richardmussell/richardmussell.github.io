# Security Policy & Incident Response

## 🔒 Security Governance Framework

This document outlines the security policies, procedures, and incident response protocols for the portfolio repository.

---

## 🛡️ Supported Versions

We actively maintain and provide security updates for the following:

| Version | Supported          |
| ------- | ------------------ |
| Main Branch | ✅ Yes |
| Release Tags | ✅ Yes |
| Legacy Branches | ❌ No |

---

## 🚨 Reporting a Vulnerability

**DO NOT OPEN A PUBLIC ISSUE** if you discover a security vulnerability.

### Reporting Process

1. **Email Security Team**: [REPLACE_WITH_SECURITY_EMAIL]
   - Subject: `[SECURITY] Portfolio Vulnerability Report`
   - Include: Description, steps to reproduce, potential impact

2. **Initial Response**: Within 24 hours
   - Acknowledgment of receipt
   - Assessment timeline (typically 48-72 hours)

3. **Status Updates**: Weekly until resolution

4. **Disclosure**: Coordinated disclosure after patch is deployed

### What to Include

- **Vulnerability Type**: (XSS, CSRF, Injection, etc.)
- **Affected Components**: (Specific files, endpoints, workflows)
- **Proof of Concept**: Steps to reproduce
- **Potential Impact**: Severity assessment
- **Suggested Fix**: (Optional, but appreciated)

---

## 🔥 Incident Response Protocol

### Severity Classification

| Severity | Response Time | Description |
|----------|---------------|-------------|
| **Critical** | < 1 hour | Active exploitation, data breach, defacement |
| **High** | < 4 hours | Remote code execution, privilege escalation |
| **Medium** | < 24 hours | Information disclosure, XSS, CSRF |
| **Low** | < 72 hours | Best practice violations, minor issues |

### "Kill Switch" - Emergency Takedown Protocol

In case of **compromise, defacement, or active attack**:

#### Step 1: Immediate Containment (0-15 minutes)

```bash
# 1. Revoke all deployment keys and tokens
# - GitHub Actions tokens
# - GitHub Pages deployment tokens
# - Any third-party service tokens

# 2. Disable GitHub Pages deployment
# Repository Settings → Pages → Source: None (Disable)

# 3. Lock repository (if critical)
# Repository Settings → Danger Zone → Archive repository
```

#### Step 2: Maintenance Mode Page (15-30 minutes)

1. **Create Emergency Static Page**:
   - File: `public/index.html` (simple static HTML)
   - Content: "Site temporarily unavailable for maintenance"

2. **Deploy Immediately**:
   ```bash
   # Force push emergency page to main branch
   git checkout main
   echo '<!DOCTYPE html><html><head><title>Maintenance</title></head><body><h1>Site Under Maintenance</h1></body></html>' > public/index.html
   git add public/index.html
   git commit -m "EMERGENCY: Maintenance mode"
   git push origin main --force
   ```

3. **Verify Deployment**:
   - Check GitHub Pages deployment status
   - Verify site shows maintenance page
   - Confirm no active vulnerabilities accessible

#### Step 3: Investigation & Remediation

1. **Forensic Analysis**:
   - Review commit history for unauthorized changes
   - Audit GitHub Actions logs
   - Check for secret leaks in repository history
   - Review access logs (GitHub, third-party services)

2. **Remediation Steps**:
   - Rollback to last known good commit
   - Rotate all secrets and tokens
   - Patch identified vulnerabilities
   - Update dependencies

3. **Verification**:
   - Security scan (gitleaks, dependency audit)
   - Manual code review
   - Penetration testing (if critical)

#### Step 4: Recovery & Post-Mortem

1. **Gradual Recovery**:
   - Deploy from clean state
   - Enable monitoring/alerts
   - Staged rollout (if possible)

2. **Post-Incident Review**:
   - Document timeline and root cause
   - Update security procedures
   - Implement additional safeguards

---

## 🔐 Security Best Practices

### Code Security

- ✅ **No Secrets in Code**: All secrets must use GitHub Secrets
- ✅ **Dependency Scanning**: Dependabot enabled, Critical/High break builds
- ✅ **Secret Scanning**: gitleaks scans every PR
- ✅ **SHA Pinning**: All GitHub Actions use immutable SHA hashes
- ✅ **Least Privilege**: Minimal permissions for workflows

### Repository Security

- ✅ **Branch Protection**: Main branch protected, requires PR reviews
- ✅ **Commit Signing**: (Optional but recommended)
- ✅ **Environment Isolation**: Dev vs Prod secrets separated
- ✅ **Regular Audits**: Weekly dependency scans, monthly security reviews

### Supply Chain Security

- ✅ **Action SHA Pinning**: All actions pinned to commit SHAs
- ✅ **Dependency Audits**: Automated scanning via Dependabot
- ✅ **Signed Commits**: (Recommended for enhanced integrity)

---

## 📋 Security Checklist

### Pre-Commit
- [ ] No secrets, API keys, or tokens in code
- [ ] No `.env` files committed
- [ ] No hardcoded credentials
- [ ] Code reviewed by at least one other person

### Pre-Deployment
- [ ] All dependencies scanned (no Critical/High vulnerabilities)
- [ ] Secret scanning passed (gitleaks)
- [ ] Build succeeds without warnings
- [ ] Security headers verified

### Post-Deployment
- [ ] Site accessible and functional
- [ ] Security headers present (CSP, etc.)
- [ ] No exposed secrets or credentials
- [ ] Monitoring enabled (if applicable)

---

## 🔍 Vulnerability Disclosure Timeline

1. **Discovery**: Vulnerability reported
2. **Acknowledgment**: 24 hours
3. **Assessment**: 48-72 hours
4. **Patch Development**: Variable (depends on severity)
5. **Testing**: 24-48 hours
6. **Deployment**: Immediate after testing
7. **Public Disclosure**: After patch deployed (coordinated)

---

## 📞 Contact Information

**Security Email**: [REPLACE_WITH_SECURITY_EMAIL]

**For non-security issues**: Open a regular GitHub Issue

**GitHub Security Advisory**: https://github.com/richardmussell/richardmussell.github.io/security/advisories

---

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

---

**Last Updated**: {{ now.Format "2006-01-02" }}
**Security Policy Version**: 1.0

