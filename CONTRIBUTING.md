# Contributing to Zenloop React Native SDK

We love your input! We want to make contributing to the Zenloop React Native SDK as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

### Pull Requests

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Development Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- React Native development environment (for testing)
- iOS/Android simulators or devices

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/zenloop/react-native-sdk.git
   cd react-native-sdk
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the SDK**
   ```bash
   npm run build
   ```

4. **Run example apps for testing**
   ```bash
   # React Native example
   cd example/ZenloopSurveyExample
   npm install
   npm run ios  # or npm run android
   
   # Expo example  
   cd ../ZenloopExpoExample
   npm install
   npx expo start
   ```

## Code Style

We use TypeScript and follow these conventions:

- **TypeScript**: All code should be written in TypeScript
- **ESLint**: Code should pass ESLint checks
- **Prettier**: Code should be formatted with Prettier
- **Naming**: Use camelCase for variables/functions, PascalCase for components

### Running Linters

```bash
npm run lint        # Check for linting errors
npm run lint:fix    # Fix auto-fixable linting errors
npm run format      # Format code with Prettier
```

## Testing

### Running Tests

```bash
npm test           # Run all tests
npm test:watch     # Run tests in watch mode
npm test:coverage  # Run tests with coverage report
```

### Writing Tests

- Write tests for all new functionality
- Maintain or improve code coverage
- Use React Native Testing Library for component tests
- Mock external dependencies appropriately

Example test structure:
```tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ZenloopSurvey } from '../src';

describe('ZenloopSurvey', () => {
  it('should render survey questions', () => {
    const { getByText } = render(
      <ZenloopSurvey orgId="test" surveyId="test" />
    );
    
    expect(getByText('Loading survey...')).toBeTruthy();
  });
});
```

## Project Structure

```
src/
├── components/          # React components
│   ├── Survey/         # Main survey component
│   ├── questions/      # Question type components
│   └── common/         # Shared components
├── hooks/              # React hooks
├── services/           # API services
├── types/              # TypeScript type definitions
├── contexts/           # React contexts
└── utils/              # Utility functions

example/                # Example applications
├── ZenloopSurveyExample/    # React Native example
└── ZenloopExpoExample/      # Expo example

docs/                   # Documentation
tests/                  # Test files
```

## Adding New Features

### New Question Types

To add a new question type:

1. **Define the TypeScript interface** in `src/types/question.ts`
   ```tsx
   export interface NewQuestionType extends BaseQuestion {
     type: 'newtype';
     // Add specific properties
   }
   ```

2. **Create the component** in `src/components/questions/NewQuestion/`
   ```tsx
   export const NewQuestion: React.FC<NewQuestionProps> = ({
     question,
     value,
     onChange,
     error,
     theme
   }) => {
     // Component implementation
   };
   ```

3. **Add to QuestionRenderer** in `src/components/QuestionRenderer.tsx`
   ```tsx
   if (question.type === 'newtype') {
     return <NewQuestion {...props} />;
   }
   ```

4. **Export from index** in `src/index.ts`
5. **Add tests** in `tests/components/questions/`
6. **Update documentation** in `docs/`

### New Services

For new API services:

1. Create service class in `src/services/api/`
2. Follow existing patterns for error handling and retry logic
3. Add comprehensive TypeScript types
4. Include unit tests
5. Update API documentation

## Documentation

### Updating Documentation

- Update README.md for major changes
- Update API.md for new APIs or breaking changes
- Update COMPONENTS.md for new components
- Add examples to EXAMPLES.md for new features
- Include JSDoc comments for public APIs

### Writing Good Documentation

- Use clear, concise language
- Include working code examples
- Explain the "why" not just the "what"
- Keep examples up to date with code changes

## Reporting Bugs

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/zenloop/react-native-sdk/issues/new).

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

### Bug Report Template

```markdown
## Summary
Brief description of the issue

## Environment
- SDK Version: 
- React Native Version:
- Platform: iOS/Android/Both
- Device/Simulator:

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Code Sample
```tsx
// Minimal code sample that reproduces the issue
```

## Additional Information
Any other relevant information
```

## Feature Requests

We welcome feature requests! Please:

1. Check if the feature already exists or is planned
2. Open a GitHub issue with the "feature request" label
3. Describe the feature and its use case
4. Provide examples of how it would be used

### Feature Request Template

```markdown
## Feature Description
Clear description of the proposed feature

## Use Case
Why is this feature needed? What problem does it solve?

## Proposed API
How would this feature be used?

```tsx
// Example of proposed API
```

## Alternatives Considered
What other approaches were considered?
```

## Submitting Changes

### Commit Messages

Use clear and meaningful commit messages:

```bash
feat: add support for custom rating scales
fix: resolve theme merging issue with partial themes  
docs: update API documentation for useSurvey hook
test: add tests for checkbox validation
refactor: simplify survey state management
```

Follow [Conventional Commits](https://conventionalcommits.org/) format:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests
- `chore`: Changes to the build process or auxiliary tools

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. **Make your changes**
   - Follow code style guidelines
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm run build
   npm test
   npm run lint
   ```

4. **Test with example apps**
   - Test your changes with both example applications
   - Ensure everything works on iOS and Android

5. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: add my new feature"
   git push origin feature/my-new-feature
   ```

6. **Open a Pull Request**
   - Use the PR template
   - Include screenshots/videos for UI changes
   - Reference any related issues

### Pull Request Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added for new functionality
- [ ] Tested on iOS simulator/device
- [ ] Tested on Android simulator/device
- [ ] Tested with example applications

## Screenshots (if applicable)
Add screenshots or videos of the changes

## Related Issues
Closes #123
```

## Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality additions  
- **PATCH** version for backwards-compatible bug fixes

### Release Checklist

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Run full test suite
4. Test example applications
5. Build and verify package
6. Create release notes
7. Tag release
8. Publish to npm

## Code of Conduct

### Our Pledge

We are committed to making participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment include:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

### Enforcement

Project maintainers are responsible for clarifying the standards of acceptable behavior and are expected to take appropriate and fair corrective action in response to any instances of unacceptable behavior.

## Getting Help

- 📖 [Documentation](./docs/)
- 💬 [GitHub Discussions](https://github.com/zenloop/react-native-sdk/discussions)
- 🐛 [GitHub Issues](https://github.com/zenloop/react-native-sdk/issues)
- 📧 [Email Support](mailto:support@zenloop.com)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for their contributions
- Special recognition for significant contributions

Thank you for contributing to make the Zenloop React Native SDK better! 🎉