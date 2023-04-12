import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";

export const Logout = async () => {
    try {
        await signOut(auth);
        // window.location.replace("/");
        console.log(auth?.currentUser?.email);
    } catch (err) {
        console.error(err);
    }
};

<button onClick={Logout}>Logout</button>;
