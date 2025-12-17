export async function requestPermission() {
    return await Notification.requestPermission();
}

export function sendNotification(title: string, options?: NotificationOptions) {
    if (Notification.permission === "granted") {
        new Notification(title, options);
    } else {
        console.warn("Notification permission not granted.");
    }
}

