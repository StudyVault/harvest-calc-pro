import { render } from '@testing-library/react';
import SideDiagram from '../components/SideDiagram';

describe('SideDiagram', () => {
  it('renders an SVG element', () => {
    const { container } = render(<SideDiagram shape="rectangle" activeSide="a" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders for triangle shape', () => {
    const { container } = render(<SideDiagram shape="triangle" activeSide="a" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders for each side without crashing', () => {
    const sides = ['a', 'b', 'c', 'd'] as const;
    sides.forEach(side => {
      const { container } = render(<SideDiagram shape="rectangle" activeSide={side} />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });
});
