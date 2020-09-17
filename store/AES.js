const  iv = CryptoJS.enc.Hex.parse("30313233343536373839414243444546");   //十六位十六进制数作为密钥偏移量

function Encrypt(text, oriKey) {

    var enc = CryptoJS.AES.encrypt(text ,CryptoJS.enc.Utf8.parse(oriKey),{
        iv:iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    })
    var enced = enc.ciphertext.toString()
    return enced;

}

// 解密
function Decrypt(text, oriKey) {
    var dec = CryptoJS.AES.decrypt(CryptoJS.format.Hex.parse(text), CryptoJS.enc.Utf8.parse(oriKey),{
        iv:iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    })
    return CryptoJS.enc.Utf8.stringify(dec);
}