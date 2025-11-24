# 🤝 Contributing Guide

Thank you for considering contributing to the Jewelry E-Commerce Application! This document provides guidelines and instructions for contributing.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

---

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in your interactions.

### Expected Behavior

- ✅ Be respectful and inclusive
- ✅ Provide constructive feedback
- ✅ Focus on what is best for the community
- ✅ Show empathy towards others

### Unacceptable Behavior

- ❌ Harassment or discrimination
- ❌ Trolling or insulting comments
- ❌ Personal or political attacks
- ❌ Publishing others' private information

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Git
- Code editor (VS Code recommended)

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/jewelry-ecommerce.git
   cd jewelry-ecommerce
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/jewelry-ecommerce.git
   ```

### Setup Development Environment

1. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Install frontend dependencies**:
   ```bash
   cd ../frontend
   npm install
   ```

3. **Configure environment variables**:
   - Copy `.env.example` to `.env` in both `backend/` and `frontend/`
   - Fill in your local configuration

4. **Start development servers**:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

---

## 🔄 Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
```

**Branch naming conventions**:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

**Examples**:
- `feature/add-payment-gateway`
- `fix/cart-total-calculation`
- `docs/update-api-documentation`

### 2. Make Changes

- Write clean, readable code
- Follow the coding standards (see below)
- Add comments for complex logic
- Update documentation if needed

### 3. Test Your Changes

```bash
# Backend tests (if available)
cd backend
npm test

# Frontend tests (if available)
cd frontend
npm test

# Manual testing
# - Test all affected features
# - Check responsive design
# - Verify API endpoints
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add payment gateway integration"
```

See [Commit Guidelines](#commit-guidelines) for commit message format.

### 5. Keep Your Branch Updated

```bash
git fetch upstream
git rebase upstream/main
```

### 6. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 7. Create Pull Request

- Go to GitHub and create a Pull Request
- Fill in the PR template
- Link related issues
- Request review

---

## 💻 Coding Standards

### JavaScript/React

#### General Rules

- Use **ES6+** syntax
- Use **functional components** with hooks
- Use **const** for constants, **let** for variables
- Use **arrow functions** for callbacks
- Use **async/await** instead of promises chains

#### Naming Conventions

```javascript
// Components - PascalCase
const ProductCard = () => { }

// Functions - camelCase
const calculateTotal = () => { }

// Constants - UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:5000';

// Files - PascalCase for components, camelCase for utilities
ProductCard.jsx
authController.js
```

#### Code Style

```javascript
// ✅ Good
const ProductCard = ({ product }) => {
    const { name, price, image } = product;
    
    const handleClick = () => {
        console.log('Product clicked');
    };
    
    return (
        <div className="product-card" onClick={handleClick}>
            <img src={image} alt={name} />
            <h3>{name}</h3>
            <p>₹{price}</p>
        </div>
    );
};

// ❌ Bad
const ProductCard = (props) => {
    return <div className="product-card">
        <img src={props.product.image} />
        <h3>{props.product.name}</h3>
        <p>₹{props.product.price}</p>
    </div>
}
```

### CSS

#### Naming Convention

Use **BEM** (Block Element Modifier):

```css
/* Block */
.product-card { }

/* Element */
.product-card__image { }
.product-card__title { }

/* Modifier */
.product-card--featured { }
.product-card__title--large { }
```

#### Organization

```css
/* 1. Positioning */
.element {
    position: relative;
    top: 0;
    left: 0;
}

/* 2. Box Model */
.element {
    display: flex;
    width: 100%;
    padding: 1rem;
    margin: 1rem 0;
}

/* 3. Typography */
.element {
    font-size: 1rem;
    color: #333;
}

/* 4. Visual */
.element {
    background: #fff;
    border: 1px solid #ddd;
}

/* 5. Misc */
.element {
    cursor: pointer;
    transition: all 0.3s;
}
```

### Backend (Node.js/Express)

#### Controller Structure

```javascript
// ✅ Good
exports.getProducts = async (req, res, next) => {
    try {
        const { category, page = 1, limit = 12 } = req.query;
        
        const query = category ? { category } : {};
        const products = await Product.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit);
        
        res.status(200).json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        next(error);
    }
};
```

#### Error Handling

```javascript
// ✅ Good - Use try-catch and next()
exports.createProduct = async (req, res, next) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, product });
    } catch (error) {
        next(error);
    }
};

// ❌ Bad - No error handling
exports.createProduct = async (req, res) => {
    const product = await Product.create(req.body);
    res.json(product);
};
```

---

## 📝 Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
# Feature
git commit -m "feat(auth): add Google OAuth integration"

# Bug fix
git commit -m "fix(cart): correct total calculation with discounts"

# Documentation
git commit -m "docs(api): update authentication endpoints"

# Refactor
git commit -m "refactor(products): extract filter logic to utility"

# With body
git commit -m "feat(orders): add WhatsApp integration

- Add WhatsApp message generation
- Include order details in message
- Add redirect to WhatsApp Web

Closes #123"
```

### Commit Best Practices

- ✅ Write clear, concise messages
- ✅ Use present tense ("add" not "added")
- ✅ Keep subject line under 50 characters
- ✅ Reference issues in footer
- ❌ Don't commit commented code
- ❌ Don't commit console.logs
- ❌ Don't commit .env files

---

## 🔍 Pull Request Process

### Before Creating PR

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] Commits are clean and descriptive
- [ ] Branch is up to date with main

### PR Title Format

```
<type>: <description>
```

**Examples**:
- `feat: Add payment gateway integration`
- `fix: Resolve cart total calculation bug`
- `docs: Update API documentation`

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Tested locally
- [ ] All tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots here

## Related Issues
Closes #123
```

### Review Process

1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Address feedback** if requested
4. **Approval** from at least one maintainer
5. **Merge** by maintainer

---

## 🧪 Testing Guidelines

### Manual Testing Checklist

**Before submitting PR**:

- [ ] Feature works as expected
- [ ] No console errors
- [ ] Responsive on mobile/tablet/desktop
- [ ] Works in Chrome, Firefox, Safari
- [ ] No broken links or images
- [ ] Loading states work correctly
- [ ] Error states display properly

### Writing Tests (Future)

```javascript
// Example test structure
describe('ProductCard Component', () => {
    it('should render product name', () => {
        // Test implementation
    });
    
    it('should display discounted price', () => {
        // Test implementation
    });
    
    it('should call onClick when clicked', () => {
        // Test implementation
    });
});
```

---

## 📚 Documentation

### When to Update Documentation

Update documentation when you:
- Add new features
- Change API endpoints
- Modify environment variables
- Update dependencies
- Change architecture

### Documentation Files

- `README.md` - Project overview
- `docs/API_DOCUMENTATION.md` - API reference
- `docs/ARCHITECTURE.md` - System architecture
- `docs/CONTRIBUTING.md` - This file
- Code comments - Complex logic

### Code Comments

```javascript
// ✅ Good - Explain WHY, not WHAT
// Calculate discount based on user tier and product category
// Premium users get 10% extra discount on gold items
const discount = calculateDiscount(user.tier, product.category);

// ❌ Bad - States the obvious
// Set discount to result of calculateDiscount
const discount = calculateDiscount(user.tier, product.category);
```

---

## 🐛 Reporting Bugs

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 96]
- Version: [e.g. 1.0.0]

**Additional context**
Any other relevant information.
```

---

## 💡 Feature Requests

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
What you want to happen.

**Describe alternatives you've considered**
Other solutions you've thought about.

**Additional context**
Any other relevant information.
```

---

## 🎯 Areas for Contribution

### Good First Issues

- Documentation improvements
- UI/UX enhancements
- Bug fixes
- Writing tests
- Code refactoring

### Advanced Contributions

- Payment gateway integration
- Email notifications
- Advanced search
- Performance optimization
- Mobile app (React Native)

---

## 📞 Getting Help

- **Questions**: Open a GitHub Discussion
- **Bugs**: Open a GitHub Issue
- **Security**: Email maintainers directly
- **Chat**: Join our community (if available)

---

## 🙏 Recognition

Contributors will be:
- Listed in `CONTRIBUTORS.md`
- Mentioned in release notes
- Credited in documentation

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing! 🎉**

Your contributions make this project better for everyone.
