
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://myeijeejhfzlxptlerqi.supabase.co';
const supabaseKey = 'sb_publishable_nxNqdHoTMIg9qpFrguVsvQ_myylV-lQ';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const signUpWithEmail = async (email: string, pass: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password: pass });
  if (error) throw error;
  return data;
};

export const signInWithEmail = async (email: string, pass: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
  if (error) throw error;
  return data;
};

export const signInWithGoogle = async () => {
  // Use window.location.origin to get the current base URL (local or production)
  // We ensure there is no trailing slash logic issues by using origin directly
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { 
      redirectTo: window.location.origin,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
  if (error) throw error;
};

export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const fetchProjects = async () => {
  const { data, error } = await supabase
    .from('dev_uploads')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

const getFileNameFromUrl = (url: string) => {
  if (!url) return null;
  try {
    const parts = url.split('/');
    return parts[parts.length - 1].split('?')[0];
  } catch (e) {
    return null;
  }
};

/**
 * FINAL AGGRESSIVE DELETE
 * Pehle DB row udaega, Storage fail ho toh parwah nahi.
 */
export const deleteProject = async (projectId: string, userEmail: string) => {
  console.log("Attempting to remove project:", projectId);

  // 1. Fetch info for storage cleanup before row is gone
  const { data: project } = await supabase
    .from('dev_uploads')
    .select('image_url, zip_url')
    .eq('id', projectId)
    .single();

  // 2. DELETE FROM DATABASE (This is the most important part for the UI)
  const { error: dbError } = await supabase
    .from('dev_uploads')
    .delete()
    .eq('id', projectId)
    .eq('email', userEmail.toLowerCase()); // RLS will also check this

  if (dbError) {
    console.error("DB Delete Failed:", dbError);
    throw new Error(`Database Error: ${dbError.message}. RLS policy might be blocking you.`);
  }

  // 3. TRY to clean up storage, but don't fail if files are already missing
  if (project) {
    try {
      const img = getFileNameFromUrl(project.image_url);
      const zip = getFileNameFromUrl(project.zip_url);
      if (img) await supabase.storage.from('project-images').remove([img]);
      if (zip) await supabase.storage.from('project-zips').remove([zip]);
      console.log("Storage cleanup attempted.");
    } catch (e) {
      console.warn("Storage cleanup failed (files might already be gone):", e);
    }
  }

  return true;
};

export const recordOrder = async (orderData: any) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([{ ...orderData, user_email: orderData.user_email.toLowerCase(), created_at: new Date().toISOString() }]);
  if (error) throw error;
  return data;
};

export const uploadToStorage = async (bucket: string, file: File) => {
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${file.name.split('.').pop()}`;
  const { error } = await supabase.storage.from(bucket).upload(fileName, file);
  if (error) throw error;
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return urlData.publicUrl;
};

export const saveProjectToDatabase = async (projectData: any) => {
  const { data, error } = await supabase
    .from('dev_uploads')
    .insert([{ ...projectData, email: projectData.email.toLowerCase(), created_at: new Date().toISOString() }]);
  if (error) throw error;
  return data;
};
