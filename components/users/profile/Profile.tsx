"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProfile } from "@/store/slices/profileSlice";
import { RootState, AppDispatch } from "@/store";
import ProfileEditForm from "./ProfileEditForm";
import { RiLoader3Fill } from "react-icons/ri";

export default function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, error } = useSelector(
    (state: RootState) => state.profile
  );
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchProfile()).unwrap();
      } finally {
        setIsLoading(false); 
      }
    };

    fetchData();
  }, [dispatch]);

  const handleProfileUpdate = () => {
    setSuccessMessage("Your profile has been updated successfully!");
    setTimeout(() => setSuccessMessage(null), 3000); 
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-light">
        <div className="flex justify-center items-center"><RiLoader3Fill size={20} color="primary" className="animate-spin mr-3" /> Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-light">
        <div className="text-red-500 font-semibold">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-light">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {successMessage && (
          <div className="bg-green-100 text-green-800 p-4 rounded-md mb-4 text-center">
            {successMessage}
          </div>
        )}
        {user ? (
          <>
            <h1 className="text-2xl font-bold mb-4">Profile</h1>
            <ProfileEditForm user={user} onUpdate={handleProfileUpdate} />
          </>
        ) : (
          <div className="text-gray-700 text-center">
            User data could not be loaded.
          </div>
        )}
      </div>
    </div>
  );
}
