import config from "../envconfig/envVars.js";
import { languageSupport } from "./constant.js";
import MESSAGES_DATA from "../language/english.js";

/**
 * @Method Method used to get response message
 * @author Neeraj-Mehra
 * @param {*} message 
 * @date 18-JULY-2025
 */
export const getMessage = async (language, message) => {
    if (language == languageSupport.english) {
        const englishMessage = await MESSAGES_DATA[message];
        return englishMessage;
    } else {
        const otherMessgae = await MESSAGES_DATA[message];
        return otherMessgae;
    }
}
