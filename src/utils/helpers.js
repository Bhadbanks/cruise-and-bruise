// src/utils/helpers.js
import { format } from 'timeago.js'; // This is the dependency import

export const timeAgo = (timestamp) => {
    if (!timestamp) return 'just now';
    // Firebase timestamps need to be converted to Date objects
    if (timestamp.toDate) {
        return format(timestamp.toDate());
    }
    // Handle standard Date objects or strings
    return format(timestamp);
};
