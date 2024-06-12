function log(msg, type) {
    if(!msg) return;
    if(!type) type = "info"
    let d = new Date();
    let date = ((d.getMonth() > 8) ? (d.getMonth() + 1) : ('0' + (d.getMonth() + 1))) + '/' + ((d.getDate() > 9) ? d.getDate() : ('0' + d.getDate())) + '/' + d.getFullYear();
    let time = d.toTimeString().split(' ')[0];
    let str = `[${date} ${time}] `

    switch(type.toLowerCase()){
        case "error":
        case "err":
            str = str + `[ERROR] `
            break

        case "info":
            str = str + `[INFO] `
            break

        case "misc":
            str = str + `[MISC] `
            break;

        case "warn":
            str = str + `[WARN] `
            break

        case "debug":
            str = str + `[DEBUG] `
            break

        case "game":
            str = str + `[GAME] `
            break

        default:
            str = str + `[INFO] `
            break
    }

    console.log(str + msg)
};

module.exports = { log }