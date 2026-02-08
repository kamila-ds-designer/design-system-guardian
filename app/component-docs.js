/**
 * Component documentation content — matches docs_generated13–16
 */

export const COMPONENT_DOCS = {
  button: {
    name: 'Button',
    label: 'COMPONENT',
    meta: [
      'Component Type: Input | Action | Interactive',
      'Pattern Scopes: Many, reusable across all domains',
      'Envolved Components: shadcn/ui, Radix UI Slot Primitive',
    ],
    anatomy: 'A Button component is composed of the following elements: Container: The clickable surface with padding and border radius. Label Text: Editable text that describes the action (required). Left Icon: Optional icon positioned before the label text. Right Icon: Optional icon positioned after the label text. Loading Indicator: Optional spinner that replaces content during async operations.',
    purpose: 'Buttons are interactive elements that trigger actions, submit forms, or navigate users to different parts of an application. They provide clear visual affordance and immediate feedback for user interactions.',
    whenToUse: ['Triggering an action or event', 'Submitting forms', 'Opening dialogs or models', 'Confirming or cancelling operations', 'Primary call-to-action on a page'],
    whenNotToUse: ['Navigation to another page (use Link)', 'Toggling settings (use Switch/Toggle)', 'Selecting from multiple options (use Radio/Checkbox)', 'Opening dropdown menus (use Select)'],
    alternatives: ['Link: For navigation between pages', 'Toggle: For binary on/off states', 'Menu Button: For revealing a menu of options', 'Icon Button: For actions without text labels'],
    mistakes: ['Multiple Primary Buttons: Limit to one primary button per section to maintain clear hierarchy', 'Vague Button Labels: Use specific, action-oriented labels instead of generic text like "OK" or "Submit"', 'Inconsistent Styling: Always use system-defined button variants rather than creating custom styles'],
    accessibility: ['Keyboard Accessible: All buttons must be accessible via Tab key and activated with Enter or Space', 'Focus Indicators: Provide clear, visible focus indicators that meet WCAG 2.4.7 requirements', 'Descriptive Labels: Button text should clearly describe the action. For icon-only buttons, include aria-label', 'Color Contrast: Maintain minimum 4.5:1 contrast ratio for text and 3:1 for interactive elements', 'Loading States: Use aria-busy="true" and aria-live regions to announce loading status to screen readers'],
    doList: ['Use clear, action-oriented labels', 'Maintain consistent button hierarchy', 'Provide visual feedback on interaction', 'Disable buttons when action is unavailable', 'Use loading states for async operations', 'Keep primary buttons limited to one per section'],
    dontList: ['Use multiple primary buttons per section', 'Create custom button styles inconsistently', 'Use buttons for navigation (use links)', 'Make destructive actions too easy to trigger', 'Use vague labels like "OK" or "Click Here"', 'Rely solely on color to convey meaning'],
    codeExample: `import { Button } from '@components/ui/button'

<Button variant="primary">Primary Button</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="danger">Danger</Button>`,
    resources: ['WCAG 2.1 Button Guidelines: Accessibility standards for button implementation', 'Radix UI Button Documentation: Technical documentation for the underlying primitive', 'Button Design Patterns: Industry best practices and design patterns'],
  },
  input: {
    name: 'Input',
    label: 'COMPONENT',
    meta: [
      'Component Type: Form Control | Data Entry | Input',
      'Purpose: Simple',
      'Allows: reusable across all forms',
      'Involved Components: shadcn/ui, native HTML input element',
    ],
    anatomy: 'An Input component is composed of the following elements: Label Text: Editable text that describes the input field (required for accessibility). Container: The input field itself with border and background. Placeholder Text: Optional text shown when input is empty. Left Icon: Optional icon positioned on the left side (e.g., search icon). Right Icon: Optional icon on the right side that can be visible/hidden. Alert/Helper Text: Optional text below the input for errors or guidance.',
    purpose: 'Input fields allow users to enter and edit text data. They are fundamental form controls for collecting user information such as names, emails, passwords, search queries, and other text-based data.',
    whenToUse: ['Short text entry (names, emails)', 'Single line data input', 'Search functionality', 'Numerical values', 'URLs or specific formats'],
    whenNotToUse: ['Long text or paragraph (use Textarea)', 'Selecting from predefined options (use Select)', 'Date/time selection (use DatePicker)', 'File uploads (use File Input)'],
    alternatives: ['Textarea: For multi-line text input', 'Select: For choosing from a list', 'Checkbox: For binary yes/no selections', 'DatePicker: For date selection'],
    mistakes: ['Missing Labels: Every input must have a visible label. Placeholders are not substitutes for labels.', 'Unclear Error Messages: Provide specific, actionable error messages instead of generic "Invalid input".', 'Wrong Input Type: Use appropriate input types (email, tel, number) for better mobile keyboards and validation.'],
    accessibility: ['Label Association: Every input must have an associated label element with proper for/id relationship.', 'Error Announcements: Use aria-describedby to associate error messages with inputs for screen reader users.', 'Required Fields: Mark required fields with aria-required="true" and visual indicator (asterisk).', 'Autocomplete Attributes: Use appropriate autocomplete values to help users fill forms faster.', 'Input Type Specification: Use correct input types (email, tel, number) for proper mobile keyboard support.'],
    doList: ['Always provide visible labels', 'Use appropriate input types', 'Show real-time validation feedback', 'Include helpful placeholder examples', 'Mark required fields clearly', 'Provide specific error messages'],
    dontList: ['Use placeholder as label replacement', 'Show all errors on initial focus', 'Use type="text" for specialized data', 'Make required fields unmarked', 'Provide vague error messages', 'Validate before user finishes typing'],
    codeExample: `import { Input, Label } from '@components/ui/input'

<Label htmlFor="email">Email Address</Label>
<Input type="email" id="email" placeholder="your@example.com" required />

<Label htmlFor="password">Password*</Label>
<Input type="password" id="password" aria-describedby="pwd-error" />
<span id="pwd-error">Password must be at least 8 characters</span>`,
    resources: ['WCAG 2.1 Form Input Guidelines: Accessibility guidelines for input fields', 'HTML Input Type Reference: Complete guide to input types and attributes', 'Form validation Patterns: Best practices for validating user input'],
  },
  tag: {
    name: 'Tag',
    label: 'COMPONENT',
    meta: [
      'Component Type: Label | Status | Categorization | Non-interactive',
      'Why it is needed: Alerts, visuals for categorization and metadata.',
      'Technical Considerations: Shadow DOM, parser, custom styling.',
    ],
    anatomy: 'A Tag component is composed of the following elements: Container: Small rectangular surface with minimal padding. Label Text: Short text describing the category, status, or metadata of a Tag. Icon (Optional): Small icon positioned before the text for visual emphasis. Dot Indicator (Optional): Small circular indicator for status or categorization. Tags are typically non-interactive and used purely for display and categorization.',
    purpose: 'Tags are small, non-interactive labels used to categorize, label, or provide status information about content, modules, states, or metadata at a glance. Unlike chips, they help users quickly identify and understand content. Often, tags are typically read only and not meant for user interaction.',
    whenToUse: ['Content categorization (topics, types)', 'Status indicators (active, pending, archived)', 'Metadata display (version, date, author)', 'Keyword or topic labeling', 'Priority or severity levels', 'Read-only filter indicators'],
    whenNotToUse: ['User input or filtering (use chips)', 'Counters or notifications (use badges)', 'Actionable items (use buttons)', 'Navigation elements (use tabs/menu)'],
    alternatives: ['Badge: For numerical counts or notifications.', 'Label: For form field labels.', 'Chip: For interactive or removable items.', 'Button: For clickable category navigation.'],
    mistakes: ['Making tags clickable: Tags should be non-interactive. If you need clickable labels, use chips or buttons instead.', 'Overusing Color: Too many different colors create visual chaos. Use color sparingly for status or priority.', 'Long Text in Tags: Tags should contain 1-2 words maximum. Longer text should use different components.'],
    accessibility: ['Color Independence: Don\'t rely solely on color to convey meaning. Always include text labels alongside color coding.', 'Contrast Ratios: Ensure text within tags meets WCAG AA contrast requirements (4.5:1 for normal text).', 'Screen Reader Support: Tags should be semantically HTML elements (span or div) or appropriately labelled with ARIA labels for context.', 'Non-Interactive Indication: Tags should not have hover or focus states that suggest interactivity unless they truly are interactive.', 'Readable Font Size: Maintain minimum font size of 12px for legibility, even for small tags.'],
    doList: ['Keep labels short (1-2 words max)', 'Use sparingly when color meanings', 'Group related tags together', 'Use subtle variants to reduce visual weight', 'Ensure adequate text contrast', 'Combine color with text labels'],
    dontList: ['Make tags look clickable if they\'re not', 'Use too many different colors', 'Include lengthy descriptions', 'Rely on color alone for meaning', 'Make tags the primary UI element', 'Use for interactive functionality'],
    codeExample: `import { Tag } from '@components/ui/tag'

<Tag variant="default">Default</Tag>
<Tag variant="primary">Primary</Tag>
<Tag variant="success">Success</Tag>
<Tag variant="danger">Danger</Tag>
<Tag size="small">Small</Tag>
<Tag size="large">Large</Tag>`,
    resources: ['WCAG Color Contrast Guidelines: Ensuring accessibility for colored labels', 'Semantic HTML for Labels: Build accessible tags with HTML', 'Status Indicator Design Patterns: Effective use of tags for status communication'],
  },
  chips: {
    name: 'Chips',
    label: 'COMPONENT',
    meta: [
      'Component Type: Chips | Selection | Status | Data | Feedback',
      'Pattern Scope: Many, reusable, occurs forms and filters',
      'Enabled Components: Stateful, Custom component with interaction states',
    ],
    anatomy: 'A Chips component is composed of the following elements: Container: Rounded, pill-shaped surface. Label Text: Editable text. Left Icon: Optional icon. Remove Button: Optional circular close icon. Avatar/Image: Optional.',
    purpose: 'Chips are compact elements that represent an input, attribute, or action. They can be used for filtering, selection, or triggering actions. Unlike tags, chips are typically interactive and can be selected, removed, or trigger actions.',
    whenToUse: ['Representing selected filters', 'Multi-select input', 'Showing selected attributes', 'Quick action triggers', 'Removable items'],
    whenNotToUse: ['Primary navigation', 'Single selection (use Radio)', 'Static labels (use Tag)', 'Critical primary actions'],
    alternatives: ['Badge: For numerical counts', 'Checkbox: For multi-select', 'Button: For single actions', 'Tag: For read-only labels'],
    mistakes: ['Too Many Chips: Limit chips to avoid overwhelming the interface.', 'Unclear Remove Action: Make remove affordance obvious.', 'Mixing Interaction Types: Don\'t mix selectable and removable chips without clear distinction.'],
    accessibility: ['Keyboard Navigation: Support Tab, Enter/Space for selection.', 'ARIA Roles: Use button, removable, or group as appropriate.', 'Selection States: Use aria-selected for selectable chips.', 'Focus Indicators: Provide clear focus ring.', 'Group Labels: Use aria-label for chip groups.'],
    doList: ['Keep labels concise', 'Show clear states', 'Group related chips', 'Provide removal affordance', 'Consider sizing', 'Support keyboard navigation'],
    dontList: ['Use long text', 'Mix interactive/static chips', 'Make remove require confirmation', 'Use for critical primary actions', 'Overcrowd the interface', 'Use for single-select options'],
    codeExample: `import { Chip } from '@components/ui/chip'

<Chip selected>Option 1</Chip>
<Chip>Option 2</Chip>
<Chip removable onRemove={() => {}}>Removable</Chip>
<Chip variant="success">Success</Chip>
<Chip size="small">Small</Chip>`,
    resources: ['Material Design Chips Overview: Design guidelines for chips', 'ARIA Authoring Practices for Chips: Accessibility implementation', 'Multi-Select Input Pattern: Best practices for chip selection'],
  },
};
