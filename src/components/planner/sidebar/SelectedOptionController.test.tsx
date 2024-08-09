import React from 'react';
import {render, screen, fireEvent } from '@testing-library/react';
import SelectedOptionController from './SelectedOptionController';

import '@testing-library/jest-dom/vitest';
import MultipleOptionsContext from '../../../contexts/MultipleOptionsContext';
import CombinedProvider from '../../../contexts/CombinedProvider';

describe("Option name", () => {
    const DEFAULT_FIRST_OPTION_NAME = "Horário 1";

    it("Should be able to change name", () => {

        render(
            <CombinedProvider>
                <SelectedOptionController currentOption={[]} />
            </CombinedProvider>
        );
        
        const nameInput = screen.getByRole('textbox', { id: /option-name/i });
        expect(nameInput.value).toBe('Horário 1');

        const newOptionName = "newOption";
        fireEvent.change(nameInput, { target: { value: newOptionName } });

        expect(nameInput.value).toBe(newOptionName);
    })
})