import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// Adjust the import path and exported name as needed; for example:
import VisitsTracker from '../src/components/ui/VisitsTracker';

describe('VisitsTracker UK Visit Test', () => {
  // Initial stats with existing UK visits
  const initialStats = {
    'UK': 3,
    'US': 7
  };

  // Updated stats after new UK visit
  const updatedStats = {
    'UK': 4,  // Incremented by 1
    'US': 7
  };

  beforeEach(() => {
    // Reset fetch mock
    (fetch as jest.Mock).mockReset();
  });

  it('handles UK visit tracking end-to-end', async () => {
    // Mock initial stats fetch
    (fetch as jest.Mock)
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(initialStats)
      }));

    render(<VisitsTracker />);

    // Wait for initial stats to load
    await waitFor(() => {
      expect(screen.getByText(/total visits: 10/i)).toBeInTheDocument();
      expect(screen.getByText(/UK: 3/i)).toBeInTheDocument();
    });

    // Initial UK visits count
    const initialUKVisits = screen.getByText(/UK: 3/i);
    expect(initialUKVisits).toBeInTheDocument();

    // Mock the POST request for new UK visit
    (fetch as jest.Mock)
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      }))
      // Mock the subsequent GET request for updated stats
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(updatedStats)
      }));

    // Enter and submit 'uk' in the form
    const input = screen.getByPlaceholderText(/enter country code/i);
    fireEvent.change(input, { target: { value: 'uk' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });

    // Verify POST request was made with correct country code
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/stats\/UK$/i),
        expect.objectContaining({
          method: 'POST'
        })
      );
    });

    // Verify stats are updated and displayed
    await waitFor(() => {
      // Check total visits increased
      expect(screen.getByText(/total visits: 11/i)).toBeInTheDocument();
      // Check UK visits increased by 1
      expect(screen.getByText(/UK: 4/i)).toBeInTheDocument();
    });

    // Verify number of fetch calls
    expect(fetch).toHaveBeenCalledTimes(3); // Initial load + POST + GET updated stats
  });

  it('normalizes UK country code to uppercase', async () => {
    (fetch as jest.Mock)
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      }));

    render(<VisitsTracker />);

    const input = screen.getByPlaceholderText(/enter country code/i);
    fireEvent.change(input, { target: { value: 'uk' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/stats\/UK$/),
        expect.any(Object)
      );
    });
  });
});
