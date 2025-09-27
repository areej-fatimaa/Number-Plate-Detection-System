import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase-config";

const getUserDoc = async (username: string) => {
  const userRef = doc(firestore, "user", username);
  const userDoc = await getDoc(userRef);
  return { userRef, userDoc };
};

const updateUserDoc = async (userRef: any, data: any) => {
  await updateDoc(userRef, data);
};

export const createUser = async (username: string) => {
  const currentDate = new Date();
  await setDoc(doc(firestore, "user", username), {
    username: username,
    plan: "free",
    startDate: new Date().toISOString(),
    endDate: new Date(currentDate.setMonth(currentDate.getMonth() + 1)).toISOString(),
    Upload_Limit: 10,
    Today_Limit: 10,
    Last_Uploaded: new Date(),
  });
};

export const updateUserPlan = async (userId: string) => {
  try {
    const { userRef, userDoc } = await getUserDoc(userId);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const currentDate = new Date();
      const today = currentDate.toISOString().split('T')[0];
      let { plan, endDate, startDate, Upload_Limit, lastUploaded, Today_Limit } = userData;
      let todayLimit = Today_Limit;
      startDate = currentDate.toISOString();
      endDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1)).toISOString();

      if (endDate?.toDate && endDate.toDate() < currentDate) {
        plan = "free";
        startDate = currentDate.toISOString();
        Upload_Limit = 10;
        endDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1)).toISOString();
      }

      if (!lastUploaded || lastUploaded !== today) {
        lastUploaded = today;
        todayLimit = Upload_Limit || 10;
      }

      await updateUserDoc(userRef, {
        plan,
        startDate,
        Upload_Limit: Upload_Limit,
        endDate,
        lastUploaded,
        Today_Limit: todayLimit,
      });
    } else {
      createUser(userId);
    }
  } catch (error) {
    console.error("Error updating user plan:", error);
  }
  return "";
};

export const subscriptionUpdate = async (username: string) => {
  try {
    const { userRef, userDoc } = await getUserDoc(username);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      let { plan } = userData;
      let lim = plan === "Basic" ? 50 : plan === "Premium" ? 200 : 300;

      await updateUserDoc(userRef, {
        Upload_Limit: lim,
        Today_Limit: lim,
      });
    } else {
      console.log("User not found.");
    }
  } catch (error) {
    console.error("Error updating user plan:", error);
  }
  return "";
};

export const getTodayLimit = async (username: string) => {
  try {
    const { userRef, userDoc } = await getUserDoc(username);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const { Today_Limit } = userData;
      console.log(`Today_Limit for ${username}: ${Today_Limit}`);
      return Today_Limit;
    } else {
      console.log("User not found.");
      return null;
    }
  } catch (error) {
    console.error("Error getting Today_Limit:", error);
  }
};

export const decrementTodayLimit = async (username: string) => {
  try {
    const { userRef, userDoc } = await getUserDoc(username);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      let { Today_Limit } = userData;

      if (Today_Limit > 0) {
        Today_Limit -= 1;

        await updateUserDoc(userRef, { Today_Limit });
        console.log(`Today_Limit for ${username} decremented. New value: ${Today_Limit}`);
      } else {
        console.log(`Today_Limit for ${username} is already 0.`);
      }
    } else {
      console.log("User not found.");
    }
  } catch (error) {
    console.error("Error decrementing Today_Limit:", error);
  }
};
export const setLastUploaded = async (username: string) => {
  try {
    const { userRef, userDoc } = await getUserDoc(username);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const { Last_Uploaded } = userData;
      const currentDate = new Date().toISOString().split('T')[0];

      if (Last_Uploaded && Last_Uploaded.toDate && new Date(Last_Uploaded.toDate()).toISOString().split('T')[0] === currentDate) {
        console.log(`Last_Uploaded for ${username} is already set to today.`);
      } else {
        await updateUserPlan(username);
        await updateUserDoc(userRef, { Last_Uploaded: currentDate });
        console.log(`Last_Uploaded for ${username} set to ${currentDate}`);
      }
    } else {
      console.log("User not found.");
    }
  } catch (error) {
    console.error("Error setting Last_Uploaded:", error);
  }
};