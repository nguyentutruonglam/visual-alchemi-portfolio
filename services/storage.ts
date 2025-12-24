import { db } from '../firebaseConfig';
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { Project, UserProfile, INITIAL_PROJECTS, INITIAL_PROFILE } from '../types';

// Collection Names
const PROJECTS_COL = 'projects';
const PROFILE_COL = 'settings';
const PROFILE_DOC_ID = 'user_profile';

// --- PROJECTS ---

export const getProjects = async (): Promise<Project[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, PROJECTS_COL));
    const projects: Project[] = [];
    querySnapshot.forEach((doc) => {
      projects.push(doc.data() as Project);
    });
    
    // If DB is empty, return initial (and maybe seed it? kept simple for now)
    if (projects.length === 0) {
        return INITIAL_PROJECTS; // Fallback for display if no DB connection
    }
    
    // Sort by year descending (simple sort)
    return projects.sort((a, b) => parseInt(b.year) - parseInt(a.year));
  } catch (error) {
    console.error("Error fetching projects:", error);
    return INITIAL_PROJECTS; // Fallback to local data on error
  }
};

export const saveProjects = async (projects: Project[]) => {
    // In Firestore, we usually update individual docs, but to match previous bulk logic:
    // We will loop through and set them.
    // Note: This function signature changed from synchronous void to Promise<void>
    try {
        const batchPromises = projects.map(p => setDoc(doc(db, PROJECTS_COL, p.id), p));
        await Promise.all(batchPromises);
    } catch (e) {
        console.error("Error saving projects", e);
        alert("Lỗi lưu dữ liệu lên Cloud. Kiểm tra Console.");
    }
};

export const deleteProjectDoc = async (id: string) => {
    try {
        await deleteDoc(doc(db, PROJECTS_COL, id));
    } catch (e) {
        console.error("Error deleting project", e);
    }
};

// --- PROFILE ---

export const getProfile = async (): Promise<UserProfile> => {
  try {
    const docRef = doc(db, PROFILE_COL, PROFILE_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { ...INITIAL_PROFILE, ...docSnap.data() } as UserProfile;
    } else {
      return INITIAL_PROFILE;
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    return INITIAL_PROFILE;
  }
};

export const saveProfile = async (profile: UserProfile) => {
  try {
     await setDoc(doc(db, PROFILE_COL, PROFILE_DOC_ID), profile);
  } catch (e) {
      console.error("Error saving profile", e);
      alert("Lỗi lưu Profile lên Cloud.");
  }
};