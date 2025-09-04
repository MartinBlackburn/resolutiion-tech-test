export const formatDate = (date: string | Date) => {
    const dateObj = new Date(date);

    return dateObj.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};
