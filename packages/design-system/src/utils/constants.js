/**
 * Constants
 */
const AnnotationPresenters = {
  Animation: 'Animation',
  Border: 'Border',
  BorderRadius: 'BorderRadius',
  Color: 'Color',
  Easing: 'Easing',
  FontFamily: 'FontFamily',
  FontSize: 'FontSize',
  FontWeight: 'FontWeight',
  LetterSpacing: 'LetterSpacing',
  LineHeight: 'LineHeight',
  Opacity: 'Opacity',
  Shadow: 'Shadow',
  Spacing: 'Spacing',
  Other: 'Other',
};
const TokenTypes = {
  Base: 'base',
  Gradient: 'gradient',
  Font: 'font',
  Typography: 'typography',
  Effect: 'effect',
  Grid: 'grid',
  Border: 'border',
  Breakpoint: 'breakpoint',
  Radius: 'radius',
  Spacing: 'spacing',
  Motion: 'motion',
};
const TokenCategories = {
  Color: 'color',
  Size: 'size',
  Time: 'time',
  Asset: 'asset',
  Content: 'content',
};

module.exports = {
  TokenTypes,
  TokenCategories,
  AnnotationPresenters,
};
