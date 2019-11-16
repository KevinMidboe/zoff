import * as path from "path";
import version from "../VERSION";

export const clientRoutingPath = path.resolve('server', 'routing/client');
console.log('rounting path: ', clientRoutingPath);
export const publicPath = path.resolve('server', 'public');
export const handlersPath = path.resolve('server', "handlers");
export const pathThumbnails = __dirname;
export const VERSION = version;

function checkCert() {
    let secure = false;
    try {
        const cert_config = require(path.join(
            __dirname, "../config/cert_config.js"));
        secure = true;
    } catch (err) {}
    return secure;
}

export const certAvailble = checkCert();