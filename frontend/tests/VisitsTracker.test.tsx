import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VisitsTracker from '../src/components/ui/VisitsTracker';
 
// Mock fetch
global.fetch = jest.fn();

describe('VisitsTracker Component', () => {
    beforeEach(() => {
        (fetch as jest.Mock).mockClear();
    });

    it('renders without crashing', () => {
        render(<VisitsTracker />);
        expect(screen.getByText(/visits tracker/i)).toBeInTheDocument();
    });

    it('handles country code input correctly', async () => {
        (fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ success: true }),
            })
        );

        render(<VisitsTracker />);

        const input = screen.getByPlaceholderText(/enter country code/i);
        fireEvent.change(input, { target: { value: 'US' } });
        fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                expect.stringMatching(/\/api\/stats\/US$/),
                expect.any(Object)
            );
        });
    });

    it('displays error message for invalid country code', async () => {
        (fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ error: 'Invalid country code' }),
            })
        );

        render(<VisitsTracker />);

        const input = screen.getByPlaceholderText(/enter country code/i);
        fireEvent.change(input, { target: { value: 'USA' } });
        fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });

        await waitFor(() => {
            expect(screen.getByText(/invalid country code/i)).toBeInTheDocument();
        });
    });

    it('displays loading state when fetching', async () => {
        let resolvePromise: (value: any) => void;
        (fetch as jest.Mock).mockImplementationOnce(() =>
            new Promise((resolve) => {
                resolvePromise = resolve;
            })
        );

        render(<VisitsTracker />);

        const input = screen.getByPlaceholderText(/enter country code/i);
        fireEvent.change(input, { target: { value: 'GB' } });
        fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });

        expect(screen.getByText(/loading/i)).toBeInTheDocument();

        resolvePromise!({
            ok: true,
            json: () => Promise.resolve({ success: true }),
        });
    });

    it('displays visit statistics correctly', async () => {
        const mockStats = {
            total: 42,
            countries: [
                { countryCode: 'US', visits: 20 },
                { countryCode: 'GB', visits: 15 },
                { countryCode: 'FR', visits: 7 },
            ],
        };

        (fetch as jest.Mock)
            .mockImplementationOnce(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockStats),
                })
            );

        render(<VisitsTracker />);

        await waitFor(() => {
            expect(screen.getByText(/total visits: 42/i)).toBeInTheDocument();
            expect(screen.getByText(/US: 20/i)).toBeInTheDocument();
            expect(screen.getByText(/GB: 15/i)).toBeInTheDocument();
            expect(screen.getByText(/FR: 7/i)).toBeInTheDocument();
        });
    });
});
