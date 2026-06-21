import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Simulator } from '../components/Intelligence/Simulator';
import { useStore } from '../core/store';
import React from 'react';

// Mock zustand store for testing
vi.mock('../core/store', () => {
  let state = {
    result: {
      totalAnnualTons: 10,
      totalAnnualKg: 10000,
      breakdown: {
        transport: { kg: 5000 },
        diet: { kg: 5000 },
        home: { kg: 0 },
        shopping: { kg: 0 }
      }
    },
    inputs: {
      weeklyKm: 100,
      shortFlights: 2,
      longFlights: 1,
      dietType: 'heavy-meat'
    },
    setPipelineResult: vi.fn(),
  };

  return {
    useStore: Object.assign(
      (selector: (state: unknown) => unknown) => selector(state),
      {
        getState: () => state,
        setState: (newState: Partial<typeof state>) => { state = { ...state, ...newState }; }
      }
    )
  };
});

vi.mock('../services/core/carbonCalculator', () => ({
  calculate: vi.fn((inputs) => {
    if (inputs.weeklyKm < 100) return { totalAnnualKg: 9000 };
    return { totalAnnualKg: 10000 };
  })
}));

describe('Simulator Component', () => {
  beforeEach(() => {
    useStore.setState({
      result: {
        totalAnnualTons: 10,
        totalAnnualKg: 10000,
        breakdown: {
          transport: { kg: 5000 },
          diet: { kg: 5000 },
          home: { kg: 0 },
          shopping: { kg: 0 }
        }
      },
      inputs: {
        weeklyKm: 100,
        shortFlights: 2,
        longFlights: 1,
        dietType: 'heavy-meat'
      },
      setPipelineResult: vi.fn(),
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('renders initial simulated value correctly', () => {
    render(<Simulator />);
    expect(screen.getByText('10000')).toBeInTheDocument(); // 10 tons * 1000 kg
  });

  it('updates simulated value when sliders are moved', () => {
    render(<Simulator />);
    
    // Find a slider (Transport for instance)
    const sliders = screen.getAllByRole('slider');
    const transportSlider = sliders[0];
    
    fireEvent.change(transportSlider, { target: { value: '50' } });
    
    // Changing the slider to 50% drive reduction:
    // baseTransport = 5000
    // savings = 5000 * (50 * 0.4 / 100) = 1000
    // newTotal = 10000 - 1000 = 9000
    expect(screen.getByText('9000')).toBeInTheDocument();
  });
});
