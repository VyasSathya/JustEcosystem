---
id: TASK-{ID}
title: Implement {COMPONENT_NAME} Component
status: ⚪ Not Started
priority: High
phase: 1
mvp: true
dependencies: [{DEPENDENCY_TASKS}]
assignee: "{ASSIGNEE_NAME}"
due_date: "{DUE_DATE}"
last_updated: "{CURRENT_DATE}"
doc_impact: medium
affected_docs: ["DOC-COMPONENT-{COMPONENT_ID}"]
---

## Description

Implement the {COMPONENT_NAME} component for the JustStuff UI according to the specifications in the juststuff-ui.md document and the component documentation template.

## Requirements

- The component should match the mobile-first design specified in the juststuff-ui.md document
- Implement all states and variants as described in the component documentation
- Ensure the component is fully responsive across all device sizes
- Follow accessibility guidelines (WCAG 2.1 AA)
- Include comprehensive TypeScript types for all props and events

## Technical Specifications

### Component Structure

```typescript
// Define the component's props interface
interface {COMPONENT_NAME}Props {
  // Add required props here
}

// The component should follow this basic structure
const {COMPONENT_NAME}: React.FC<{COMPONENT_NAME}Props> = (props) => {
  // Implementation details
};
```

### Styling Approach

- Use Tailwind CSS for styling
- Follow the established color scheme and design tokens
- Implement responsive behavior using Tailwind's responsive utilities

### Testing Requirements

- Write unit tests for all component functionality
- Include tests for all component variants and states
- Test accessibility with axe-core

## Acceptance Criteria

- [ ] Component renders correctly in all required states
- [ ] Component is responsive across all breakpoints
- [ ] Component passes all unit tests
- [ ] Component passes accessibility tests
- [ ] Component is documented according to the template
- [ ] Props interface is fully typed with JSDoc comments
- [ ] Code follows project coding standards

## Resources

- [Component Design Mockup]({MOCKUP_LINK})
- [Juststuff UI Documentation](../docs/juststuff-ui.md)
- [Component Documentation Template](../.docs/templates/COMPONENT.md)

## Notes

{ADDITIONAL_NOTES} 