import { Colors } from '../../constants/Colors';

describe('Colors', () => {
  it('exports light and dark color schemes', () => {
    expect(Colors.light).toBeDefined();
    expect(Colors.dark).toBeDefined();
  });

  it('light scheme has all required color keys', () => {
    const keys = [
      'text',
      'background',
      'tint',
      'icon',
      'subtext',
      'border',
      'card',
      'tabIconDefault',
      'tabIconSelected',
    ];
    for (const key of keys) {
      expect(Colors.light).toHaveProperty(key);
    }
  });

  it('dark scheme has all required color keys', () => {
    const keys = [
      'text',
      'background',
      'tint',
      'icon',
      'subtext',
      'border',
      'card',
      'tabIconDefault',
      'tabIconSelected',
    ];
    for (const key of keys) {
      expect(Colors.dark).toHaveProperty(key);
    }
  });

  it('light and dark schemes have the same keys', () => {
    const lightKeys = Object.keys(Colors.light).sort();
    const darkKeys = Object.keys(Colors.dark).sort();
    expect(lightKeys).toEqual(darkKeys);
  });

  it('all color values are valid hex strings', () => {
    const hexPattern = /^#[0-9a-fA-F]{6}$/;
    for (const color of Object.values(Colors.light)) {
      expect(color).toMatch(hexPattern);
    }
    for (const color of Object.values(Colors.dark)) {
      expect(color).toMatch(hexPattern);
    }
  });

  it('light background is white and dark background is dark', () => {
    expect(Colors.light.background).toBe('#ffffff');
    expect(Colors.dark.background).toBe('#0f172a');
  });

  it('tabIconSelected matches tint for each scheme', () => {
    expect(Colors.light.tabIconSelected).toBe(Colors.light.tint);
    expect(Colors.dark.tabIconSelected).toBe(Colors.dark.tint);
  });
});
