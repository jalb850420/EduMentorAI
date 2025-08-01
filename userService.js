import { db } from "./firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const createUserIfNotExists = async (user, role = "estudiante") => {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      name: user.displayName || "",
      photoURL: user.photoURL || "",
      role,
      createdAt: new Date().toISOString(),
    });
    console.log("Usuario creado en Firestore ✅");
  } else {
    console.log("Usuario ya existe en Firestore");
  }
};
