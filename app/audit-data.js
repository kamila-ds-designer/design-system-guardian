/**
 * QA Audit mock data — matches Hackathon Product UI Design 21/22
 */

export const AUDIT_ISSUES = [
  { id: 'ctx1', category: 'Context', type: 'Component', severity: 'critical', issue: 'Button uses wrong variant', expected: 'Primary and Secondary supposed to be next...', elementId: 'product-title', details: null },
  { id: 'ctx2', category: 'Context', type: 'Component', severity: 'critical', issue: 'Component used incorrectly - wr..', expected: 'Use Card component instead of custom div', elementId: 'card', details: null },
  { id: 'tech1', category: 'Technical', type: 'Component', severity: 'critical', issue: 'Using Component from Library', expected: 'Use component from the design system', elementId: 'card', details: null },
  { id: 'tech2', category: 'Technical', type: 'Variable', severity: 'medium', issue: 'Color/style variables not linking...', expected: 'Color contrast issue', elementId: 'badge', details: null },
  { id: 'tech3', category: 'Technical', type: 'States', severity: 'medium', issue: 'Missing States in Components', expected: 'over/Active/Disabled variants missing', elementId: 'card', details: null },
  { id: 'tech4', category: 'Technical', type: 'Typography', severity: 'medium', issue: 'Text style mismatch', expected: 'Should be Body/Medium', elementId: 'product-title', details: null },
  { id: 'tech5', category: 'Technical', type: 'Spacing', severity: 'low', issue: 'Incorrect padding on card', expected: 'Should use spacing-4 token', elementId: 'card', details: ['Height: 40px (should be 44px)', 'Using #3882F6 instead of token color.primary.500', 'Border radius: 6px (should be 8px)'] },
];

export const EXPANDED_DETAILS = {
  ctx1: {
    figmaInstruction: 'Switch to Primary or Secondary variant from the design system Button component.',
    figmaLink: 'Open Button in Figma',
    quickActions: ['Replace with Library Component', 'Copy Component Link'],
    codeExample: '<Button variant="primary">Submit</Button>',
  },
  ctx2: {
    figmaInstruction: 'Replace the custom div with the Card component from your design system library.',
    figmaLink: 'Open Card in Figma',
    quickActions: ['Replace with Library Component', 'Copy Component Link'],
    codeExample: '<Card className="shadow-nd p-6" />',
  },
  tech5: {
    figmaInstruction: 'Use the Button / Primary / Large component from the library. This ensures the correct height (44px) and applies the primary-500 token.',
    figmaLink: 'Open Component in Figma',
    quickActions: ['Replace with Library Component', 'Copy Component Link'],
    codeExample: '<Card className="shadow-nd p-6" />',
  },
};
