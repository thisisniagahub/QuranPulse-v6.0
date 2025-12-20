import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import IqraDigitalReader from '../IqraDigitalReader';
import { IQRA_1 } from '../data';

// Mock dependencies
jest.mock('../hooks/useIqraTools', () => ({
    useIqraAudio: () => ({
        speak: jest.fn(),
        isSpeaking: false
    }),
    useVoiceRecorder: () => ({
        isRecording: false,
        startRecording: jest.fn(),
        stopRecording: jest.fn(),
        audioUrl: null,
        playRecording: jest.fn()
    })
}));

describe('IqraDigitalReader', () => {
    it('renders the first page of Iqra 1 by default', () => {
        render(<IqraDigitalReader />);
        
        // Check for title (might appear in header and content)
        const titles = screen.getAllByText(IQRA_1.pages[0].title);
        expect(titles.length).toBeGreaterThan(0);
        
        // Check for content cells (e.g. "ب (BA)")
        const firstCellContent = IQRA_1.pages[0].rows[0].cells[0]; 
        expect(screen.getByText(firstCellContent)).toBeInTheDocument();
    });

    it('navigates to the next page when "Seterusnya" is clicked', async () => {
        render(<IqraDigitalReader />);
        
        const nextButton = screen.getByText(/Seterusnya/i);
        fireEvent.click(nextButton);

        // Should now show Page 2
        await waitFor(() => {
            const titles = screen.getAllByText(IQRA_1.pages[1].title);
            expect(titles.length).toBeGreaterThan(0);
        });
    });

    it('changes volume when level selector is clicked', async () => {
        render(<IqraDigitalReader />);
        
        // Find level 2 button
        const level2Button = screen.getByText('2', { selector: 'button.w-8' });
        fireEvent.click(level2Button);

        // Should show Iqra 2 title (MUKA SURAT 1: KULIT BUKU)
        await waitFor(() => {
            const titles = screen.getAllByText(/KULIT BUKU/i);
            expect(titles.length).toBeGreaterThan(0);
        });
    });

    it('shows tools panel when a segment is clicked', async () => {
        render(<IqraDigitalReader />);
        
        // Click on a segment
        const firstSegment = screen.getByText(IQRA_1.pages[0].rows[0].cells[0]);
        fireEvent.click(firstSegment);

        // Tools panel should appear
        await waitFor(() => {
            expect(screen.getByText(/Studio Pembelajaran/i)).toBeInTheDocument();
        });
    });
});
