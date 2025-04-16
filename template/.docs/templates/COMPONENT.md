---
id: DOC-COMPONENT-{ID}
title: "{COMPONENT_NAME} Component"
status: 🟢 Current
version: 1.0.0
last_updated: "{CURRENT_DATE}"
related_tasks: ["TASK-{RELATED_TASK}"]
contributors: ["{CONTRIBUTOR_1}"]
tags: ["component", "ui", "{COMPONENT_TYPE}"]
---

# {COMPONENT_NAME} Component

## Overview

Brief description of the component's purpose and role in the JustStuff UI.

## Visual Reference

```
[Include a screenshot, mockup or diagram here]
```

## Component API

### Props

```typescript
interface {COMPONENT_NAME}Props {
  /**
   * Description of prop1
   */
  prop1: string;
  
  /**
   * Description of prop2
   * @default defaultValue
   */
  prop2?: number;
  
  /**
   * Description of prop3
   */
  prop3: (value: any) => void;
}
```

### Usage Example

```tsx
import {COMPONENT_NAME} from 'components/{COMPONENT_PATH}';

function MyComponent() {
  return (
    <{COMPONENT_NAME}
      prop1="Example"
      prop2={42}
      prop3={(value) => console.log(value)}
    />
  );
}
```

## Behavior

### States

- **Default**: Description of the default state
- **Hover**: Description of hover state interactions
- **Active**: Description of active/pressed state
- **Disabled**: Description of disabled state (if applicable)

### Interactions

- Description of click behaviors
- Description of any drag behaviors
- Description of keyboard interactions
- Description of any animations

### Accessibility

- ARIA roles and attributes
- Keyboard navigation considerations
- Screen reader considerations
- Color contrast requirements

## Variants

### Variant 1: {VARIANT_NAME}

Description and specific prop configuration:

```tsx
<{COMPONENT_NAME} variant="{VARIANT_NAME}" />
```

### Variant 2: {VARIANT_NAME}

Description and specific prop configuration:

```tsx
<{COMPONENT_NAME} variant="{VARIANT_NAME}" />
```

## Responsiveness

| Breakpoint | Behavior |
|------------|----------|
| Mobile (<768px) | Description of mobile behavior |
| Tablet (768px-1024px) | Description of tablet behavior |
| Desktop (>1024px) | Description of desktop behavior |

## Implementation Notes

- Technical details about the implementation
- Any performance considerations
- Dependencies on other components or services
- State management approach

## Related Components

- [{RELATED_COMPONENT_1}](./COMPONENT-{RELATED_ID_1}.md) - Brief description of relationship
- [{RELATED_COMPONENT_2}](./COMPONENT-{RELATED_ID_2}.md) - Brief description of relationship

## Design Decisions

- Key design decisions and their rationales
- Alternatives considered
- Reference to any decision log entries 