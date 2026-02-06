import { db } from '../firebase-config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const saveHistory = async (user, type, details) => {
    if (!user || (!user.uid && !user.email)) return; // Ensure we have a user identifier

    try {
        // Use UID if available (Firebase Auth), fall back to email if legacy/other
        const userIdentifier = user.uid || user.email;

        // If it's a UID, we can nest it properly. If it's just an email (legacy), we might need a workaround or just skip.
        // Since we moved to Firebase Auth, we should expect user.uid.
        if (!user.uid) return;

        await addDoc(collection(db, "users", user.uid, "history"), {
            type: type, // 'prediction', 'calculation', 'compare'
            details: details,
            timestamp: serverTimestamp()
        });
        console.log(`History saved to Firestore: ${type}`);
    } catch (error) {
        console.error("Failed to save history to Firestore:", error);
    }
};
