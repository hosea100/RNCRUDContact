import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axiosInstance from '@/utils/axiosInstance';
import ContactDetailScreen from '@/app/(tabs)/contact-detail';

jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock('@/utils/axiosInstance', () => ({
  deleteRequest: jest.fn(),
  postRequest: jest.fn(),
  putRequest: jest.fn(),
}));

describe('ContactDetailScreen', () => {
  const mockNavigateBack = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      back: mockNavigateBack,
    });

    (useLocalSearchParams as jest.Mock).mockReturnValue({
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      age: '30',
      photo: 'http://example.com/photo.jpg',
      mode: 'edit',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders contact details correctly', () => {
    const { getByText, getByDisplayValue, getByRole } = render(<ContactDetailScreen />);

    expect(getByDisplayValue('John')).toBeTruthy();
    expect(getByDisplayValue('Doe')).toBeTruthy();
    expect(getByDisplayValue('30')).toBeTruthy();
    expect(getByRole('button', { name: 'Update Contact' })).toBeTruthy();
  });

  it('handles delete contact', async () => {
    (axiosInstance.deleteRequest as jest.Mock).mockResolvedValue({});

    const { getByRole } = render(<ContactDetailScreen />);
    const deleteButton = getByRole('button', { name: 'Delete Contact' });

    fireEvent.press(deleteButton);

    await waitFor(() => {
      expect(axiosInstance.deleteRequest).toHaveBeenCalledWith('https://contact.herokuapp.com/contact/1');
      expect(mockNavigateBack).toHaveBeenCalled();
    });
  });

  it('shows error when delete contact fails', async () => {
    (axiosInstance.deleteRequest as jest.Mock).mockRejectedValue(new Error('Delete failed'));

    const { getByRole, getByText } = render(<ContactDetailScreen />);
    const deleteButton = getByRole('button', { name: 'Delete Contact' });

    fireEvent.press(deleteButton);

    await waitFor(() => {
      expect(axiosInstance.deleteRequest).toHaveBeenCalledWith('https://contact.herokuapp.com/contact/1');
      expect(mockNavigateBack).not.toHaveBeenCalled();
      expect(getByText('Error: An error occurred while deleting the contact.')).toBeTruthy();
    });
  });
});
