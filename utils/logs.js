
/**
 * Displays colourful logs for useful information
 * @param {string} message - The message to be logged.
 * @param {('info'|'error'|'success')} - Type of log, otherwise default to console.log.
 */
const log = (message, type) => {

    if (!message) {
        console.log("No message specified");
        return;
    }

    switch (type) {
        case "info":
            console.log(`%c Info: ${message}`, "color: blue");
            break;

        case "error":
            console.log(`%c Error: ${message}`, "color: red");
            break;

        case "success":
            console.log(`%c Success: ${message}`, "color: green");
            break;
        default:
            console.log(message);
            break;
    }
}

export default log;