import { useState } from 'react';
import api from '../constants/api';

const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const updateCustomerProfile = async (customerId, updatedData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const payload = {
        customer_id: customerId,
        phone_number: updatedData.phone_number,
        address: updatedData.address,
      };

      const response = await api.post('/profile/edit', payload);

      if (response.data && response.data.success) {
        setSuccess(true);
        return { success: true, message: response.data.message || 'Datos del cliente actualizados con éxito.' };
      } else {
        setError(response.data?.message || 'Error al actualizar los datos del cliente.');
        return { success: false, error: response.data?.message || 'Error al actualizar los datos del cliente.' };
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error de red o del servidor al actualizar los datos del cliente.');
      return { success: false, error: err.response?.data?.message || 'Error de red o del servidor al actualizar los datos del cliente.' };
    } finally {
      setLoading(false);
    }
  };

  const fetchSocioeconomicData = async (customerId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/profile/socioeconomic/show', { customer_id: customerId });
      if (response.data && response.data.success && response.data.data) {
        return { success: true, data: response.data.data };
      }
      return { success: false, data: null };
    } catch (err) {
      return { success: false, data: null };
    } finally {
      setLoading(false);
    }
  };

  const createSocioeconomicData = async (payload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await api.post('/profile/socioeconomic/create', payload);
      if (response.data && response.data.success) {
        setSuccess(true);
        return { success: true, message: response.data.message || 'Información socioeconómica registrada con éxito.', data: response.data.data };
      }
      setError(response.data?.message || 'Error al registrar la información socioeconómica.');
      return { success: false, error: response.data?.message || 'Error al registrar la información socioeconómica.' };
    } catch (err) {
      setError(err.response?.data?.message || 'Error de red o del servidor al registrar información socioeconómica.');
      return { success: false, error: err.response?.data?.message || 'Error de red o del servidor al registrar información socioeconómica.' };
    } finally {
      setLoading(false);
    }
  };

  const updateSocioeconomicData = async (payload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await api.post('/profile/socioeconomic/update', payload);
      if (response.data && response.data.success) {
        setSuccess(true);
        return { success: true, message: response.data.message || 'Información socioeconómica actualizada con éxito.', data: response.data.data };
      }
      setError(response.data?.message || 'Error al actualizar la información socioeconómica.');
      return { success: false, error: response.data?.message || 'Error al actualizar la información socioeconómica.' };
    } catch (err) {
      setError(err.response?.data?.message || 'Error de red o del servidor al actualizar información socioeconómica.');
      return { success: false, error: err.response?.data?.message || 'Error de red o del servidor al actualizar información socioeconómica.' };
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (appUserId, imageUri) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const formData = new FormData();
      formData.append('app_user_id', String(appUserId));
      const filename = imageUri.split('/').pop() || `avatar.jpg`;
      const match = /\.([a-zA-Z0-9]+)$/.exec(filename);
      const ext = match ? match[1] : 'jpg';
      const mime = ext.toLowerCase() === 'png' ? 'image/png' : ext.toLowerCase() === 'heic' ? 'image/heic' : 'image/jpeg';
      formData.append('avatar', { uri: imageUri, name: filename, type: mime });

      const response = await api.post('/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data && response.data.success) {
        setSuccess(true);
        return { success: true, message: response.data.message || 'Avatar actualizado con éxito.', data: response.data.data };
      }
      setError(response.data?.message || 'Error al actualizar el avatar.');
      return { success: false, error: response.data?.message || 'Error al actualizar el avatar.' };
    } catch (err) {
      setError(err.response?.data?.message || 'Error de red o del servidor al actualizar el avatar.');
      return { success: false, error: err.response?.data?.message || 'Error de red o del servidor al actualizar el avatar.' };
    } finally {
      setLoading(false);
    }
  };

  return {
    updateCustomerProfile,
    fetchSocioeconomicData,
    createSocioeconomicData,
    updateSocioeconomicData,
    uploadAvatar,
    loading,
    error,
    success,
    setSuccess,
    setError,
  };
};

export default useProfile;