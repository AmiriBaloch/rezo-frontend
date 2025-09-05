"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function AccountPage() {
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [editProfile, setEditProfile] = useState({ firstName: "", lastName: "" });
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [profileIncomplete, setProfileIncomplete] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    setLoading(true);
    axios.get("/api/profile")
      .then(res => {
        const data = res.data.data;
        // If profile exists (profileExists === true), treat data as profile
        if (data && data.profileExists === true) {
          setProfileIncomplete(false);
          setUser(data.user);
          setProfile(data);
          setEditProfile({
            firstName: data.firstName || "",
            lastName: data.lastName || ""
          });
          setAvatarPreview(data.avatarUrl || "");
        } else if (data && data.profile === null) {
          setProfileIncomplete(true);
          setUser(data.user);
          setProfile(null);
          setEditProfile({
            firstName: "",
            lastName: ""
          });
          setAvatarPreview("");
        }
      })
      .catch(() => setMessage("Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = e => {
    setEditProfile({ ...editProfile, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = e => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      // Update or create profile
      await axios.put("/api/profile", editProfile);
      // Update avatar if changed
      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);
        await axios.post("/api/profile/picture", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }
      setMessage("Profile updated successfully.");
      // Optionally refetch profile
    } catch (err) {
      setMessage("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!profile && !profileIncomplete) return <div>No profile data found.</div>;

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto", padding: 24, background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #eee" }}>
      <h2>Account Information</h2>
      {profileIncomplete && <div style={{ color: "#b77", marginBottom: 16 }}>Your profile is incomplete. Please fill in your details.</div>}
      <div style={{ marginBottom: 24 }}>
        <img src={avatarPreview || "/default-avatar.png"} alt="Profile" width={100} height={100} style={{ borderRadius: "50%", objectFit: "cover" }} />
        <div>
          <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleAvatarChange} />
          <button type="button" onClick={() => fileInputRef.current.click()}>Change Picture</button>
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>First Name:</label>
        <input type="text" name="firstName" value={editProfile.firstName} onChange={handleChange} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Last Name:</label>
        <input type="text" name="lastName" value={editProfile.lastName} onChange={handleChange} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Email:</label>
        <input type="text" value={user?.email || profile?.user?.email || ""} disabled />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>ID Card:</label>
        <input type="text" value={profile?.cnicNumber || ""} disabled />
      </div>
      <button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
      {message && <div style={{ marginTop: 16 }}>{message}</div>}
    </div>
  );
} 