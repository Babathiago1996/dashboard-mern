// Contact.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { leadsAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Contact() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await leadsAPI.create(data);
      toast.success('Message sent. We will contact you soon.');
      // optional redirect after submit
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white shadow rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
        <p className="text-sm text-gray-500 mb-4">Tell us about your project — we will get back shortly.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <input {...register('name', { required: 'Name required' })} className="w-full px-4 py-2 border rounded-md" />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input {...register('email', { required: 'Email required' })} className="w-full px-4 py-2 border rounded-md" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">Message</label>
            <textarea {...register('message', { required: 'Message required' })} className="w-full px-4 py-2 border rounded-md" rows={6} />
            {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white px-5 py-2 rounded-md">
              {isSubmitting ? 'Sending…' : 'Send message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
